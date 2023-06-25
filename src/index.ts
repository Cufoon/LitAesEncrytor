import encryptCore, { type FuncParamsEncrypt } from './encrypt.js';
import decryptCore, { type FuncParamsDecrypt } from './decrypt.js';
export { ProgressTransform } from './transform.js';

export const encrypt = async (options: FuncParamsEncrypt) => {
  await encryptCore({ showProgress: false, compress: false, ...options });
};

export const decrypt = async (options: FuncParamsDecrypt) => {
  await decryptCore({ showProgress: false, ...options });
};
