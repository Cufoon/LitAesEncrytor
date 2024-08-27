import { Readable, Writable } from 'node:stream';
import type { Command } from '@commander-js/extra-typings';
import type { i18nType } from './i18n.js';
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
export interface CommandOptions {
    verbose?: boolean;
    outFile?: string;
    password?: string | true;
    [index: string]: unknown;
}
export declare const getPasswordFromUser: (password: string | undefined, options: CommandOptions, command: Command<[string, string | undefined], CommandOptions>, verbose?: boolean) => Promise<string | undefined>;
export declare const createReadableStream: (content: string | Buffer) => Readable;
export declare const createWritableStream: (callback: (arg0: Buffer) => void) => Writable;
export {};
