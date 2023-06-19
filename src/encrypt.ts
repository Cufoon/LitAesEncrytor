import { randomBytes, createCipheriv } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { join } from 'node:path';
import { createBrotliCompress, constants } from 'node:zlib';
import { statSync } from 'node:fs';

import ora from 'ora';
import chalk from 'chalk';

import { PrependInitVectTransform, ProgressTransform } from './transform.js';
import { getCipherKey, to2Str, eol, gestureIcon } from './util.js';

interface FuncParamsEncrypt {
  /** 需要加密的文件路径，相对或绝对 */
  file: string;
  /** 加密的密码 */
  password: string;
}

interface FuncEncrypt {
  (p: FuncParamsEncrypt): void;
}

const encrypt: FuncEncrypt = ({ file, password }) => {
  const initVectOrigin = randomBytes(16);
  const headerStr = 'lit';
  const header = headerStr.split('').map((item) => item.charCodeAt(0));
  initVectOrigin.forEach((item) => {
    header.push(item);
  });
  const initVect = Buffer.from(header);

  const cipherKey = getCipherKey(password);

  const originFileInfo = statSync(file);
  // const chunksN = (originFileInfo.size - 1) / (64 * 1024) + 1;
  const chunksN = Math.ceil(originFileInfo.size / (64 * 1024));

  const readStream = createReadStream(file);
  const brotli = createBrotliCompress({
    params: {
      [constants.BROTLI_PARAM_QUALITY]: 3
    }
  });
  const cipher = createCipheriv('aes256', cipherKey, initVectOrigin);
  const prependInitVect = new PrependInitVectTransform(initVect);
  const writeStream = createWriteStream(join(file + '.Lit'));

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

  let timerId: NodeJS.Timeout | null = null;
  let encryptEnd = false;
  const clock = () => {
    timerId && clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      const now = Date.now();
      const timeUsed = Math.floor((now - startTime) / 1000);
      const timeUsedMinutes = Math.floor(timeUsed / 60);
      const timeUsedSeconds = timeUsed - timeUsedMinutes * 60;
      if (encryptEnd) {
        spinner.prefixText = ` ${chalk.green('(°ー°〃)')} 总共用时: ${to2Str(
          timeUsedMinutes
        )}:${to2Str(timeUsedSeconds)}${eol}`;
        spinner.succeed('加密完成！🎉');
        return;
      }
      const timeLeft = Math.ceil(
        ((100 - currentProgressPercent) / currentProgressPercent) * timeUsed
      );
      const timeLeftMinutes = Math.floor(timeLeft / 60);
      const timeLeftSeconds = timeLeft - timeLeftMinutes * 60;

      spinner.prefixText = ` ${chalk.blue('(°ー°〃)')} 已用时间: ${to2Str(
        timeUsedMinutes
      )}:${to2Str(timeUsedSeconds)} 预计剩余时间: ${to2Str(timeLeftMinutes)}:${to2Str(
        timeLeftSeconds
      )}${eol}`;
      clock();
    }, 500);
  };

  writeStream.on('finish', () => {
    encryptEnd = true;
  });

  readStream.pipe(progress).pipe(brotli).pipe(cipher).pipe(prependInitVect).pipe(writeStream);
  clock();
};

export default encrypt;
