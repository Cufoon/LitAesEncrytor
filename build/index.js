import encryptCore, {} from './encrypt.js';
import decryptCore, {} from './decrypt.js';
export { ProgressTransform } from './transform.js';
export const encrypt = async (options) => {
    await encryptCore({ showProgress: false, compress: false, ...options });
};
export const decrypt = async (options) => {
    await decryptCore({ showProgress: false, ...options });
};
