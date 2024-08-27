import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const nowDate = new Date();

const nowDateString = (() => {
  const pad2 = (v) => String(v).padStart(2, '0');
  const year = nowDate.getFullYear();
  const month = pad2(nowDate.getMonth() + 1);
  const day = pad2(nowDate.getDate());
  const hour = pad2(nowDate.getHours());
  const minute = pad2(nowDate.getMinutes());
  const second = pad2(nowDate.getSeconds());
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
})();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packagePath = resolve(__dirname, '../package.json');
const appFilePath = resolve(__dirname, '../tsbuild/app.js');
const appInfoFilePath = resolve(__dirname, '../tsbuild/version.js');
const appInfoFileTsPath = resolve(__dirname, '../tsbuild/version.d.ts');

const packageInfo = JSON.parse(fs.readFileSync(packagePath).toString());
const appVersion = packageInfo.version;

const dataApp = fs.readFileSync(appFilePath);

fs.writeFileSync(appFilePath, '#!/usr/bin/env node\n');
fs.appendFileSync(appFilePath, dataApp);

const nowVersion = `LitAES v${appVersion}(${nowDateString})`;
const dataAppInfoPlaceholder = fs.readFileSync(appInfoFilePath).toString();
const dataAppInfo = dataAppInfoPlaceholder.replace(
  'cufoon_application_version_info_placehodler_r9b7o7W5Er48fLZU4jFD',
  `${nowVersion} @Cufoon`
);
fs.writeFileSync(appInfoFilePath, dataAppInfo);

const dataAppInfoPlaceholderTs = fs.readFileSync(appInfoFileTsPath).toString();
const dataAppInfoTs = dataAppInfoPlaceholderTs.replace(
  'cufoon_application_version_info_placehodler_r9b7o7W5Er48fLZU4jFD',
  `${nowVersion} @Cufoon`
);
fs.writeFileSync(appInfoFileTsPath, dataAppInfoTs);
