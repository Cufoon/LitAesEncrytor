import { randomBytes, createCipheriv } from 'node:crypto';
import { createReadStream, createWriteStream, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createBrotliCompress, constants } from 'node:zlib';
import { statSync } from 'node:fs';
import ora from 'ora';
import chalk from 'chalk';
import confirm from '@inquirer/confirm';
import { PrependInitVectTransform, ProgressTransform } from './transform.js';
import { getCipherKey, to2Str, eol, gestureIcon, getI18n } from './util.js';
const i18n = getI18n();
const encrypt = async ({ file, password, outFile, showProgress = true, onProgress, compress = true }) => {
    const initVectOrigin = randomBytes(16);
    const headerStr = `lit${compress ? 'c' : 'a'}`;
    const header = headerStr.split('').map((item) => item.charCodeAt(0));
    initVectOrigin.forEach((item) => {
        header.push(item);
    });
    const initVect = Buffer.from(header);
    const cipherKey = getCipherKey(password);
    const originFileInfo = statSync(file);
    const chunksN = Math.ceil(originFileInfo.size / (64 * 1024));
    const readStream = createReadStream(file);
    const brotli = createBrotliCompress({
        params: {
            [constants.BROTLI_PARAM_QUALITY]: 3
        }
    });
    const cipher = createCipheriv('aes256', cipherKey, initVectOrigin);
    const prependInitVect = new PrependInitVectTransform(initVect);
    const writeStreamPath = join(outFile ?? file + '.Lit');
    if (existsSync(writeStreamPath)) {
        const isContinue = await confirm({
            message: `${writeStreamPath}\n${i18n['app.encrypt.tip.output_file_exists']}`,
            default: true
        });
        if (!isContinue) {
            console.log(i18n['app.encrypt.tip.redesignate_output_file']);
            return;
        }
    }
    const writeStream = createWriteStream(writeStreamPath);
    const spinner = ora({
        text: `${i18n['app.encrypt.ui.progress']} 00% [----------]`,
        prefixText: ` ${chalk.blue('(°ー°〃)')} ${i18n['app.encrypt.ui.elapsed_time']}: 00:00${eol}`
    });
    let lastProgressPercent = 0;
    let currentProgressPercent = 0;
    const startTime = Date.now();
    const progress = new ProgressTransform({
        total: chunksN,
        updateProcess: (percent) => {
            onProgress?.(percent, chunksN);
            if (showProgress) {
                const floored = Math.floor(percent);
                if (floored > lastProgressPercent) {
                    lastProgressPercent = floored;
                    spinner.text = `${i18n['app.encrypt.ui.progress']} ${to2Str(floored)}% ${gestureIcon(percent)}`;
                }
                currentProgressPercent = percent;
            }
        }
    });
    let timerId = null;
    let encryptEnd = false;
    let decryptErrored = false;
    const clock = (rs) => {
        timerId && clearTimeout(timerId);
        timerId = setTimeout(() => {
            timerId && clearTimeout(timerId);
            timerId = null;
            const now = Date.now();
            const timeUsed = Math.floor((now - startTime) / 1000);
            const timeUsedMinutes = Math.floor(timeUsed / 60);
            const timeUsedSeconds = timeUsed - timeUsedMinutes * 60;
            if (decryptErrored) {
                spinner.stop();
                return;
            }
            if (encryptEnd) {
                spinner.prefixText = ` ${chalk.green('(°ー°〃)')} ${i18n['app.encrypt.ui.total_time']}: ${to2Str(timeUsedMinutes)}:${to2Str(timeUsedSeconds)}${eol}`;
                spinner.succeed(`${i18n['app.encrypt.ui.encryption_completed']}🎉`);
                rs();
                return;
            }
            const timeLeft = Math.ceil(((100 - currentProgressPercent) / currentProgressPercent) * timeUsed);
            const timeLeftMinutes = Math.floor(timeLeft / 60);
            const timeLeftSeconds = timeLeft - timeLeftMinutes * 60;
            spinner.prefixText = ` ${chalk.blue('(°ー°〃)')} ${i18n['app.encrypt.ui.elapsed_time']}: ${to2Str(timeUsedMinutes)}:${to2Str(timeUsedSeconds)} ${i18n['app.encrypt.ui.estimated_remaining_time']}: ${to2Str(timeLeftMinutes)}:${to2Str(timeLeftSeconds)}${eol}`;
            clock(rs);
        }, 300);
    };
    return await new Promise((rs, rj) => {
        const throwError = (e) => {
            timerId && clearTimeout(timerId);
            decryptErrored = true;
            spinner.stop();
            rj(e);
        };
        writeStream.on('finish', () => {
            encryptEnd = true;
            !showProgress && rs();
        });
        let runningStream = readStream
            .on('error', throwError)
            .pipe(progress)
            .on('error', throwError);
        if (compress) {
            runningStream = runningStream.pipe(brotli).on('error', throwError);
        }
        runningStream
            .pipe(cipher)
            .on('error', throwError)
            .pipe(prependInitVect)
            .on('error', throwError)
            .pipe(writeStream)
            .on('error', throwError);
        if (showProgress) {
            timerId = setTimeout(() => {
                spinner.start();
                clock(rs);
            }, 300);
        }
    });
};
export default encrypt;
