import crypto from 'node:crypto';
import { Readable, Writable } from 'node:stream';

export const getCipherKey = (password) => {
    return crypto.createHash('sha256').update(password).digest();
};

export const createReadableStream = (content) => {
    return Readable.from(content);
};
export const createWritableStream = (callback) => {
    let buffers = [];
    const writer = new Writable({
        write(chunk, encoding, cb) {
            buffers.push(chunk);
            cb();
        }
    });
    writer.on('finish', () => {
        const combinedBuffer = Buffer.concat(buffers);
        callback(combinedBuffer);
    });
    return writer;
};
