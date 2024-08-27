import decryptApi from './decrypt-api.js';
import encryptApi from './encrypt-api.js';

import type { DecryptParams } from './decrypt-api.js';
import type { EncryptParams } from './encrypt-api.js';

export const decrypt = async (options: DecryptParams) => await decryptApi(options);
export const encrypt = async (options: EncryptParams) => await encryptApi(options);
