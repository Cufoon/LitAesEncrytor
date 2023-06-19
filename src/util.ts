import { EOL } from 'node:os';
import crypto from 'node:crypto';

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
