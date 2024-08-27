import { createDecipheriv } from 'node:crypto';
import { constants, createBrotliDecompress } from 'node:zlib';

import { ProgressTransform } from '../transform.js';
import { createReadableStream, createWritableStream } from '../util.js';
import { getCipherKey } from '../util.js';
import { CHUNK_SIZE } from '../constant.js';

import type { Decipher } from 'node:crypto';
import type { Readable } from 'node:stream';
import type { BrotliDecompress } from 'node:zlib';

export interface DecryptParams {
  /** 推荐传入 Buffer，如果你喜欢传入字符串，请传入hex编码的字符串 */
  content: Buffer | string;
  password: string;
  onProgress?: <T>(percent: number, allN: number) => T;
}

interface DecryptFunc {
  (p: DecryptParams): Promise<Buffer>;
}

const isString = (v: unknown): v is string =>
  Object.prototype.toString.call(v) === '[object String]';

const getInitVect = (content: Buffer) => content.subarray(0, 20);

const content2Buffer = (content: Buffer | string) => {
  if (isString(content)) {
    return Buffer.from(content, 'hex');
  }
  return content;
};

const decrypt: DecryptFunc = async ({ content, password, onProgress }) => {
  const contentBuffer = content2Buffer(content);
  const chunksN = Math.ceil(contentBuffer.length / CHUNK_SIZE);
  const initVect = getInitVect(contentBuffer);
  const len = initVect.length;
  if (len !== 20) {
    throw new Error('Invalid init vector');
  }
  const isCompressed = initVect[3] === 'c'.charCodeAt(0);
  const initVectOrigin = initVect.subarray(4);
  const cipherKey = getCipherKey(password);
  const decipher = createDecipheriv('AES-256-CBC', cipherKey, initVectOrigin);
  const brotli = createBrotliDecompress({
    params: {
      [constants.BROTLI_PARAM_QUALITY]: 3
    },
    chunkSize: CHUNK_SIZE
  });

  const readStream = createReadableStream(contentBuffer.subarray(20));

  return await new Promise((resolve, reject) => {
    const throwError = (e: unknown) => {
      reject(e);
    };

    const writeStream = createWritableStream((buffer) => resolve(buffer));

    let pipes: BrotliDecompress | Decipher | Readable = readStream.on(
      'error',
      throwError
    );
    if (onProgress) {
      const progress = new ProgressTransform({
        total: chunksN,
        updateProcess: (percent) => {
          onProgress(percent, chunksN);
        }
      });
      pipes = pipes.pipe(progress).on('error', throwError);
    }
    pipes = pipes.pipe(decipher).on('error', throwError);
    if (isCompressed) {
      pipes = pipes.pipe(brotli).on('error', throwError);
    }
    pipes.pipe(writeStream).on('error', throwError);
  });
};

export default decrypt;
