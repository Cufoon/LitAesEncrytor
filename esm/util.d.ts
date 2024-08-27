import { Readable, Writable } from 'node:stream';
import type { i18nType } from './i18n.js';
import type { Command } from '@commander-js/extra-typings';
export declare const getI18n: () => i18nType;
export declare const getCipherKey: (password: string) => Buffer;
export declare const to2Str: (n: number) => string;
export declare const eol: string;
export declare const gestureIcon: (percent: number) => string;
type MakeAsyncInPromise<T> = (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void) => Promise<T>;
export declare const makePromise: <T>(fn: MakeAsyncInPromise<T>) => Promise<T>;
export declare const isNull: <T>(v: T) => boolean;
export declare const isNullLike: (v: any) => boolean;
export declare const isNotBlankString: (v: any) => boolean;
export declare const getPasswordFromUser: (password: string | undefined, options: {
    verbose?: true | undefined;
    outFile?: string | undefined;
    password?: string | true | undefined;
}, command: Command<[string, string | undefined], {
    verbose?: true | undefined;
    outFile?: string | undefined;
    password?: string | true | undefined;
}>, verbose?: boolean) => Promise<string | undefined>;
export declare const createReadableStream: (content: string | Buffer) => Readable;
export declare const createWritableStream: (callback: (arg0: Buffer) => void) => Writable;
export {};
