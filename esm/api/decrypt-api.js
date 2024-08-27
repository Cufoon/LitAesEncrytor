import { createDecipheriv } from 'node:crypto';
import { constants, createBrotliDecompress } from 'node:zlib';
import { ProgressTransform } from '../transform.js';
import { createReadableStream, createWritableStream } from '../util.js';
import { getCipherKey } from '../util.js';
import { CHUNK_SIZE } from '../constant.js';
const isString = (v) => Object.prototype.toString.call(v) === '[object String]';
const getInitVect = (content) => content.subarray(0, 20);
const content2Buffer = (content) => {
    if (isString(content)) {
        return Buffer.from(content, 'hex');
    }
    return content;
};
const decrypt = async ({ content, password, onProgress }) => {
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
        const throwError = (e) => {
            reject(e);
        };
        const writeStream = createWritableStream((buffer) => resolve(buffer));
        let pipes = readStream.on('error', throwError);
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
