import { createDecipheriv } from 'node:crypto';
import { createReadStream, createWriteStream, statSync } from 'node:fs';
import { createBrotliDecompress } from 'node:zlib';
import { dirname, join, parse, resolve } from 'node:path';
import ora from 'ora';
import chalk from 'chalk';
import { ProgressTransform } from './transform.js';
import { getCipherKey, to2Str, eol, gestureIcon } from './util.js';
const decrypt = ({ file, password, outFile }) => {
    const originFileInfo = statSync(file);
    const chunksN = Math.ceil(originFileInfo.size / (64 * 1024));
    const readInitVect = createReadStream(file, { end: 18 });
    let initVect;
    readInitVect.on('data', (chunk) => {
        initVect = Buffer.from(chunk);
    });
    readInitVect.on('close', () => {
        if (initVect === undefined || initVect.byteLength === 0) {
            console.log('未能读取到初始向量！');
            return;
        }
        const initVectOrigin = [];
        const len = initVect.byteLength;
        for (let i = 3; i < len; i++) {
            initVectOrigin.push(initVect[i]);
        }
        const cipherKey = getCipherKey(password);
        const readStream = createReadStream(file, { start: 19 });
        const decipher = createDecipheriv('aes256', cipherKey, Buffer.from(initVectOrigin));
        const brotli = createBrotliDecompress();
        const originFile = parse(file);
        const originExtName = originFile.ext;
        if (originExtName.toLowerCase() !== '.lit') {
            console.log('加密文件格式错误！');
        }
        const writeStream = createWriteStream(outFile ? join(outFile) : resolve(dirname(file), `${originFile.name}.Til`));
        const spinner = ora({
            text: '进度 00% [----------]',
            prefixText: ` ${chalk.blue('(°ー°〃)')} 已用时间: 00:00${eol}`
        }).start();
        let lastProgressPercent = 0;
        let currentProgressPercent = 0;
        const startTime = Date.now();
        const progress = new ProgressTransform({
            total: chunksN,
            updateProcess: (percent) => {
                const floored = Math.floor(percent);
                if (floored > lastProgressPercent) {
                    lastProgressPercent = floored;
                    spinner.text = `进度 ${to2Str(floored)}% ${gestureIcon(percent)}`;
                }
                currentProgressPercent = percent;
            }
        });
        let timerId = null;
        let decryptEnd = false;
        const clock = () => {
            timerId && clearTimeout(timerId);
            timerId = setTimeout(() => {
                timerId = null;
                const now = Date.now();
                const timeUsed = Math.floor((now - startTime) / 1000);
                const timeUsedMinutes = Math.floor(timeUsed / 60);
                const timeUsedSeconds = timeUsed - timeUsedMinutes * 60;
                if (decryptEnd) {
                    spinner.prefixText = ` ${chalk.green('(°ー°〃)')} 总共用时: ${to2Str(timeUsedMinutes)}:${to2Str(timeUsedSeconds)}${eol}`;
                    spinner.succeed('解密完成！🎉');
                    return;
                }
                const timeLeft = Math.ceil(((100 - currentProgressPercent) / currentProgressPercent) * timeUsed);
                const timeLeftMinutes = Math.floor(timeLeft / 60);
                const timeLeftSeconds = timeLeft - timeLeftMinutes * 60;
                spinner.prefixText = ` ${chalk.blue('(°ー°〃)')} 已用时间: ${to2Str(timeUsedMinutes)}:${to2Str(timeUsedSeconds)} 预计剩余时间: ${to2Str(timeLeftMinutes)}:${to2Str(timeLeftSeconds)}${eol}`;
                clock();
            }, 500);
        };
        writeStream.on('finish', () => {
            decryptEnd = true;
        });
        readStream.pipe(progress).pipe(decipher).pipe(brotli).pipe(writeStream);
        clock();
    });
};
export default decrypt;
