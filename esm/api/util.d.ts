/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { Readable, Writable } from 'node:stream';
export declare const getCipherKey: (password: string) => Buffer;
export declare const createReadableStream: (content: string | Buffer) => Readable;
export declare const createWritableStream: (callback: (arg0: Buffer) => void) => Writable;
export {};
