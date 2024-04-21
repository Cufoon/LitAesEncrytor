import _encrypt from './encrypt-api.js';
import _decrypt from './decrypt-api.js';
import type { FuncParamsEncrypt } from './encrypt-api.js';
import type { FuncParamsDecrypt } from './decrypt-api.js';

export const encrypt = async (options: FuncParamsEncrypt) => await _encrypt(options);

export const decrypt = async (options: FuncParamsDecrypt) => await _decrypt(options);
