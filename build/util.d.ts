/// <reference types="node" resolution-mode="require"/>
export declare const getCipherKey: (password: string) => Buffer;
export declare const to2Str: (n: number) => string;
export declare const eol: string;
export declare const gestureIcon: (percent: number) => string;
export declare const isNull: (v: any) => boolean;
export declare const isNullLike: (v: any) => boolean;
export declare const isNotBlankString: (v: any) => boolean;
export declare const getPasswordFromUser: (password: string | undefined, options: any, command: any, verbose?: boolean) => Promise<string | undefined>;
