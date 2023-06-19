import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appFilePath = resolve(__dirname, '../build/app.js');

const data = fs.readFileSync(appFilePath);

fs.writeFileSync(appFilePath, '#!/usr/bin/env node\n');
fs.appendFileSync(appFilePath, data);
