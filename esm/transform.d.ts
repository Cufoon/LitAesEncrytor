import { Transform } from 'node:stream';
import type { TransformCallback, TransformOptions } from 'stream';
export declare class PrependInitVectTransform extends Transform {
    initVect: Buffer;
    notPrepended: boolean;
    constructor(initVect: Buffer, opts?: TransformOptions);
    _transform(chunk: unknown, encoding: BufferEncoding, callback: TransformCallback): void;
}
interface ProgressTransformConstructorOption {
    total: number;
    updateProcess?: (percent: number) => unknown;
}
export declare class ProgressTransform extends Transform {
    processedChunksN: number;
    totalChunksN: number;
    updateProcess(percent: number): void;
    constructor({ total, updateProcess }: ProgressTransformConstructorOption, options?: TransformOptions);
    _transform(chunk: unknown, encoding: BufferEncoding, callback: TransformCallback): void;
}
export {};
