import { createDecipheriv } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { existsSync, statSync } from 'node:fs';
import { createBrotliDecompress, constants } from 'node:zlib';
import { dirname, join, parse, resolve } from 'node:path';
import ora from 'ora';
import chalk from 'chalk';
import confirm from '@inquirer/confirm';
import { ProgressTransform } from './transform.js';
import { getCipherKey, to2Str, eol, gestureIcon, getI18n } from './util.js';
import { CHUNK_SIZE } from './constant.js';
const i18n = getI18n();
const getInitVect = async (file) => await new Promise((rs) => {
    const readInitVect = createReadStream(file, { end: 19 });
    let iv = Buffer.from([]);
    readInitVect.on('data', (chunk) => {
        const chunkBuffer = Buffer.from(chunk);
        iv = Buffer.concat([iv, chunkBuffer]);
    });
    readInitVect.on('close', () => {
        rs(iv);
    });
});
const decrypt = async ({ file, password, outFile, showProgress = true, onProgress }) => {
    const originFileInfo = statSync(file);
    const chunksN = Math.ceil(originFileInfo.size / CHUNK_SIZE);
    const initVect = await getInitVect(file);
    if (initVect === undefined || initVect.byteLength === 0) {
        console.log(i18n['app.decrypt.error.fail_to_read_init_vector']);
        return;
    }
    const initVectOrigin = [];
    const len = initVect.byteLength;
    if (len !== 20) {
        console.log(i18n['app.decrypt.error.file_header_wrong']);
        return;
    }
    const isCompressed = initVect[3] === 'c'.charCodeAt(0);
    for (let i = 4; i < len; i++) {
        initVectOrigin.push(initVect[i]);
    }
    const cipherKey = getCipherKey(password);
    const decipher = createDecipheriv('AES-256-CBC', cipherKey, Buffer.from(initVectOrigin));
    const brotli = createBrotliDecompress({
        params: {
            [constants.BROTLI_PARAM_QUALITY]: 3
        },
        chunkSize: CHUNK_SIZE
    });
    const originFile = parse(file);
    const readStream = createReadStream(file, {
        start: 20,
        highWaterMark: CHUNK_SIZE
    });
    const writeStreamPath = outFile
        ? join(outFile)
        : resolve(dirname(file), `${originFile.name}.Til`);
    if (existsSync(writeStreamPath)) {
        const isContinue = await confirm({
            message: `${writeStreamPath}\n${i18n['app.decrypt.tip.output_file_exists']}`,
            default: true
        });
        if (!isContinue) {
            console.log(i18n['app.decrypt.tip.redesignate_output_file']);
            return;
        }
    }
    const writeStream = createWriteStream(writeStreamPath);
    const spinner = ora({
        text: `${i18n['app.decrypt.ui.progress']} 00% [----------]`,
        prefixText: ` ${chalk.blue('(°ー°〃)')} ${i18n['app.decrypt.ui.elapsed_time']}: 00:00${eol}`
    });
    let lastProgressPercent = 0;
    let currentProgressPercent = 0;
    const startTime = Date.now();
    const progress = new ProgressTransform({
        total: chunksN,
        updateProcess: (percent) => {
            onProgress && onProgress(percent, chunksN);
            if (showProgress) {
                const floored = Math.floor(percent);
                if (floored > lastProgressPercent) {
                    lastProgressPercent = floored;
                    spinner.text = `${i18n['app.decrypt.ui.progress']} ${to2Str(floored)}% ${gestureIcon(percent)}`;
                }
                currentProgressPercent = percent;
            }
        }
    });
    let timerId = null;
    let decryptEnd = false;
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
            if (decryptEnd) {
                spinner.prefixText = ` ${chalk.green('(°ー°〃)')} ${i18n['app.decrypt.ui.total_time']}: ${to2Str(timeUsedMinutes)}:${to2Str(timeUsedSeconds)}${eol}`;
                spinner.succeed(`${i18n['app.decrypt.ui.decryption_completed']}🎉`);
                rs();
                return;
            }
            const timeLeft = Math.ceil(((100 - currentProgressPercent) / currentProgressPercent) * timeUsed);
            const timeLeftMinutes = Math.floor(timeLeft / 60);
            const timeLeftSeconds = timeLeft - timeLeftMinutes * 60;
            spinner.prefixText = ` ${chalk.blue('(°ー°〃)')} ${i18n['app.decrypt.ui.elapsed_time']}: ${to2Str(timeUsedMinutes)}:${to2Str(timeUsedSeconds)} ${i18n['app.decrypt.ui.estimated_remaining_time']}: ${to2Str(timeLeftMinutes)}:${to2Str(timeLeftSeconds)}${eol}`;
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
            decryptEnd = true;
            !showProgress && rs();
        });
        let runningStream = readStream
            .on('error', throwError)
            .pipe(progress)
            .on('error', throwError)
            .pipe(decipher)
            .on('error', throwError);
        if (isCompressed) {
            runningStream = runningStream.pipe(brotli).on('error', throwError);
        }
        runningStream.pipe(writeStream).on('error', throwError);
        if (showProgress) {
            timerId = setTimeout(() => {
                spinner.start();
                clock(rs);
            }, 300);
        }
    });
};
export default decrypt;
