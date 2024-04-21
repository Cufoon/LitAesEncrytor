import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const nowDate = new Date();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const esmPath = resolve(__dirname, '../tsbuild');
const targetPath = resolve(__dirname, '../esm');

const copyDirectory = (source, target) => {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);

  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
};

copyDirectory(esmPath, targetPath);
