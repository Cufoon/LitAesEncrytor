import { EOL } from 'node:os';
import crypto from 'node:crypto';
import { Readable, Writable } from 'node:stream';
import passwordInput from '@inquirer/password';
import { i18n } from './i18n.js';

import type { i18nType } from './i18n.js';

let i18nOnly: i18nType | null = null;

export const getI18n = (): i18nType => {
  if (i18nOnly !== null) return i18nOnly;
  const localeCode = Intl.DateTimeFormat().resolvedOptions().locale;
  if (localeCode === 'zh-CN') {
    const en = Object.assign({}, i18n.en);
    i18nOnly = Object.assign(en, i18n.zh);
    return i18nOnly;
  }
  i18nOnly = i18n.en;
  return i18nOnly;
};

export const getCipherKey = (password: string) => {
  return crypto.createHash('sha256').update(password).digest();
};

export const to2Str = (n: number) => n.toString().padStart(2, '0');

export const eol = EOL;

const gestureIcons = [
  '[>---------]',
  '[=>--------]',
  '[==>-------]',
  '[===>------]',
  '[====>-----]',
  '[=====>----]',
  '[======>---]',
  '[=======>--]',
  '[========>-]',
  '[=========>]',
  '[==========]'
];

export const gestureIcon = (percent: number) => {
  let index = Math.floor(percent / 10);
  if (index < 0) index = 0;
  if (index > 10) index = 10;
  return gestureIcons[index];
};

type MakeAsyncInPromise<T> = (
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void
) => Promise<T>;

export const makePromise = <T>(fn: MakeAsyncInPromise<T>) =>
  new Promise<T>((resolve, reject) => {
    fn(resolve, reject);
  });

export const isNull = (v: any) => v === undefined || v === null;
export const isNullLike = (v: any) =>
  isNull(v) ||
  v === '' ||
  v === false ||
  (Object.prototype.toString.call(v) === '[object Array]' && v.length === 0) ||
  Object.getOwnPropertyNames(v).length == 0;
export const isNotBlankString = (v: any) =>
  Object.prototype.toString.call(v) === '[object String]' && v.length > 0;

export const getPasswordFromUser = async (
  password: string | undefined,
  options: any,
  command: any,
  verbose = false
): Promise<string | undefined> => {
  let fromEnvironment = false;
  if (isNotBlankString(password)) {
    if (verbose) {
      if (!isNull(options.password)) {
        console.log(
          '-p, --password and environment LITAES_PASSWORD will be ignored when password supplied in command positioned parameters'
        );
      }
    }
    return password;
  }
  if (options.password === true) {
    password = await passwordInput({ message: 'please input your password: ' });
  } else {
    password = options.password;
    if (verbose && command.getOptionValueSource('password') === 'env') {
      fromEnvironment = true;
    }
  }
  if (isNullLike(password)) {
    command.error(
      'please supply password in command or -p or environment variable LITAES_PASSWORD'
    );
    return undefined;
  }
  if (fromEnvironment) {
    console.log('password got from environment variable LITAES_PASSWORD');
  }
  return password;
};

export const createReadableStream = (content: string | Buffer) => {
  return Readable.from(content);
};

export const createWritableStream = (callback: (arg0: Buffer) => void) => {
  let buffers: Uint8Array[] = [];

  const writer = new Writable({
    write(chunk, encoding, cb) {
      buffers.push(chunk);
      cb();
    }
  });

  writer.on('finish', () => {
    const combinedBuffer = Buffer.concat(buffers);
    callback(combinedBuffer);
  });

  return writer;
};
