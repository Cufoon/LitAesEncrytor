import encrypt from './encrypt.js';
import decrypt from './decrypt.js';

const [mode, file, password] = process.argv.slice(2);

const runApp = () => {
  if (mode === 'encrypt' || mode === 'e') {
    encrypt({ file, password });
    return;
  }

  if (mode === 'decrypt' || mode === 'd') {
    decrypt({ file, password });
  }
};

runApp();
