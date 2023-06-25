import { type FuncParamsEncrypt } from './encrypt.js';
import { type FuncParamsDecrypt } from './decrypt.js';
export { ProgressTransform } from './transform.js';
export declare const encrypt: (options: FuncParamsEncrypt) => Promise<void>;
export declare const decrypt: (options: FuncParamsDecrypt) => Promise<void>;
