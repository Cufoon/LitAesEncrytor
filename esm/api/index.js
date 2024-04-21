import _encrypt from './encrypt-api.js';
import _decrypt from './decrypt-api.js';
export const encrypt = async (options) => await _encrypt(options);
export const decrypt = async (options) => await _decrypt(options);
