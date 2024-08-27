import decryptApi from './decrypt-api.js';
import encryptApi from './encrypt-api.js';
export const decrypt = async (options) => await decryptApi(options);
export const encrypt = async (options) => await encryptApi(options);
