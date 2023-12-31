/// <reference types="node" resolution-mode="require"/>
import { type i18nType } from './i18n.js';
export declare const getI18n: () => i18nType;
export declare const getCipherKey: (password: string) => Buffer;
export declare const to2Str: (n: number) => string;
export declare const eol: string;
export declare const gestureIcon: (percent: number) => string;
type MakeAsyncInPromise<T> = (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => Promise<T>;
export declare const makePromise: <T>(fn: MakeAsyncInPromise<T>) => Promise<T>;
export declare const isNull: (v: any) => boolean;
export declare const isNullLike: (v: any) => boolean;
export declare const isNotBlankString: (v: any) => boolean;
export declare const getPasswordFromUser: (password: string | undefined, options: any, command: any, verbose?: boolean) => Promise<string | undefined>;
export {};
