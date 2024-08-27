import { randomBytes, createCipheriv } from 'node:crypto';
import { createBrotliCompress, constants } from 'node:zlib';
import { PrependInitVectTransform, ProgressTransform } from '../transform.js';
import { createReadableStream, createWritableStream } from '../util.js';
import { getCipherKey } from '../util.js';
import { CHUNK_SIZE } from '../constant.js';
const encrypt = async ({ content, password, onProgress, compress = false }) => {
    const initVectOrigin = randomBytes(16);
    const headerStr = `lit${compress ? 'c' : 'a'}`;
    const header = headerStr.split('').map((item) => item.charCodeAt(0));
    initVectOrigin.forEach((item) => {
        header.push(item);
    });
    const initVect = Buffer.from(header);
    const cipherKey = getCipherKey(password);
    const chunksN = content.length;
    const readStream = createReadableStream(content);
    const brotli = createBrotliCompress({
        params: {
            [constants.BROTLI_PARAM_QUALITY]: 3
        },
        chunkSize: CHUNK_SIZE
    });
    const cipher = createCipheriv('AES-256-CBC', cipherKey, initVectOrigin);
    const prependInitVect = new PrependInitVectTransform(initVect);
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
        if (compress) {
            pipes = pipes.pipe(brotli).on('error', throwError);
        }
        pipes
            .pipe(cipher)
            .on('error', throwError)
            .pipe(prependInitVect)
            .on('error', throwError)
            .pipe(writeStream)
            .on('error', throwError);
    });
};
export default encrypt;
