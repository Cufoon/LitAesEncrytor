/// <reference types="node" resolution-mode="require"/>
import type { FuncParamsEncrypt } from './encrypt-api.js';
import type { FuncParamsDecrypt } from './decrypt-api.js';
export declare const encrypt: (options: FuncParamsEncrypt) => Promise<Buffer>;
export declare const decrypt: (options: FuncParamsDecrypt) => Promise<Buffer>;
