/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { Transform } from 'node:stream';
import type { TransformCallback, TransformOptions } from 'node:stream';
export declare class PrependInitVectTransform extends Transform {
    initVect: Buffer;
    notPrepended: boolean;
    constructor(initVect: Buffer, opts?: TransformOptions);
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void;
}
interface ProgressTransformConstructorOption {
    total: number;
    updateProcess?: (percent: number) => any;
}
export declare class ProgressTransform extends Transform {
    processedChunksN: number;
    totalChunksN: number;
    updateProcess(percent: number): any;
    constructor({ total, updateProcess }: ProgressTransformConstructorOption, options?: TransformOptions);
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void;
}
export {};
