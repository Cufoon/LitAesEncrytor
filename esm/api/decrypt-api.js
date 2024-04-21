import { Decipher, createDecipheriv } from 'node:crypto';
import { createBrotliDecompress } from 'node:zlib';
import { ProgressTransform } from '../transform.js';
import { getCipherKey, createReadableStream, createWritableStream } from '../util.js';
const getInitVect = (content) => content.subarray(0, 20);
const decrypt = async ({ content, password, onProgress }) => {
    const chunksN = Math.ceil(content.length / (64 * 1024));
    const initVect = getInitVect(content);
    const len = initVect.length;
    if (len !== 20) {
        throw new Error('Invalid init vector');
    }
    const isCompressed = initVect[3] === 'c'.charCodeAt(0);
    const initVectOrigin = initVect.subarray(4);
    const cipherKey = getCipherKey(password);
    const decipher = createDecipheriv('aes256', cipherKey, initVectOrigin);
    const brotli = createBrotliDecompress();
    const readStream = createReadableStream(content.subarray(20));
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