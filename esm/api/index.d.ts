import type { DecryptParams } from './decrypt-api.js';
import type { EncryptParams } from './encrypt-api.js';
export declare const decrypt: (options: DecryptParams) => Promise<Buffer>;
export declare const encrypt: (options: EncryptParams) => Promise<Buffer>;
