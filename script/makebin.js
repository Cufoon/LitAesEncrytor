import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const nowDate = new Date();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appFilePath = resolve(__dirname, '../build/app.js');
const appInfoFilePath = resolve(__dirname, '../build/version.js');
const appInfoFileTsPath = resolve(__dirname, '../build/version.d.ts');

const dataApp = fs.readFileSync(appFilePath);

fs.writeFileSync(appFilePath, '#!/usr/bin/env node\n');
fs.appendFileSync(appFilePath, dataApp);

const nowVersion = `LitAES v1.0.5(${nowDate.toLocaleDateString()} ${nowDate.toLocaleTimeString()})`;
const dataAppInfoPlaceholder = fs.readFileSync(appInfoFilePath).toString();
const dataAppInfo = dataAppInfoPlaceholder.replace(
  'cufoon_application_version_info_placehodler',
  `${nowVersion} @Cufoon`
);
fs.writeFileSync(appInfoFilePath, dataAppInfo);

const dataAppInfoPlaceholderTs = fs.readFileSync(appInfoFileTsPath).toString();
const dataAppInfoTs = dataAppInfoPlaceholderTs.replace(
  'cufoon_application_version_info_placehodler',
  `${nowVersion} @Cufoon`
);
fs.writeFileSync(appInfoFileTsPath, dataAppInfoTs);
