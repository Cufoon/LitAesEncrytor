import encryptApi from './encrypt-api.js';
import decryptApi from './decrypt-api.js';
export const encrypt = async (options) => await encryptApi(options);
export const decrypt = async (options) => await decryptApi(options);
