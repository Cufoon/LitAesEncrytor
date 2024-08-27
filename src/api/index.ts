import encryptApi from './encrypt-api.js';
import decryptApi from './decrypt-api.js';
import type { FuncParamsEncrypt } from './encrypt-api.js';
import type { FuncParamsDecrypt } from './decrypt-api.js';

export const encrypt = async (options: FuncParamsEncrypt) => await encryptApi(options);

export const decrypt = async (options: FuncParamsDecrypt) => await decryptApi(options);
