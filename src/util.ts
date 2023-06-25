import { EOL } from 'node:os';
import crypto from 'node:crypto';
import { input } from '@inquirer/prompts';

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
    password = await input({
      message: 'please input your password: ',
      transformer(value) {
        return value.replaceAll(/./g, '*');
      }
    });
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
