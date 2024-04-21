import { Command, Option } from '@commander-js/extra-typings';

import encrypt from './encrypt.js';
import decrypt from './decrypt.js';
import { APP_VERSION_INFO } from './version.js';
import { getI18n, getPasswordFromUser } from './util.js';

const i18n = getI18n();

const program = new Command();

program
  .name('litaes')
  .description('A cli tool to help encrypt and decrypt your data using aes-256.')
  .version(APP_VERSION_INFO, '-v, --version', 'Output the version information')
  .helpOption('-h, --help', 'The help information')
  .option('-V', 'Alias for --version')
  .passThroughOptions()
  .action((options, command) => {
    if (options.V === true) {
      console.log(APP_VERSION_INFO);
    } else {
      console.log(command.helpInformation());
    }
  })
  // .showHelpAfterError()
  .helpCommand('help [command]', 'Display help for command');

program
  .command('version')
  .description('Output the version information')
  .action(() => console.log(APP_VERSION_INFO));

program
  .command('encrypt')
  .alias('e')
  .description('Encrypt a file')
  .argument('<file>', 'The file path of the file to encrypt')
  .argument('[password]', 'The password to encrypt a file using aes256')
  .option('-v, --verbose', 'Show more detail information')
  .option('-o, --out-file <file>', 'The encrypted output file path')
  .option('-nc, --no-compress', 'Not compress file using brotli before encrypt')
  .addOption(
    new Option('-p, --password [password]', 'The password to encrypt a file using aes256').env(
      'LITAES_PASSWORD'
    )
  )
  .action(async (file, password, options, command) => {
    password = await getPasswordFromUser(password, options, command, options.verbose);
    if (options.verbose) {
      console.log('file', file);
      console.log('password', password);
      console.log('options', options);
    }
    if (password !== undefined) {
      try {
        await encrypt({
          file: file,
          password: password,
          outFile: options.outFile,
          compress: options.compress
        });
      } catch (e: unknown) {
        console.log(i18n['app.error.tip']);
        console.error(e);
      }
    }
  });

program
  .command('decrypt')
  .alias('d')
  .description('Decrypt a file encrypted by this tool')
  .argument('<file>', 'The file path of the file to decrypt')
  .argument('[password]', 'The password to decrypt a file using aes256')
  .option('-v, --verbose', 'Show more detail information')
  .option('-o, --out-file <file>', 'The decrypted output file path')
  .addOption(
    new Option('-p, --password [password]', 'The password to decrypt a file using aes256').env(
      'LITAES_PASSWORD'
    )
  )
  .action(async (file, password, options, command) => {
    password = await getPasswordFromUser(password, options, command, options.verbose);
    if (options.verbose) {
      console.log('file', file);
      console.log('password', password);
      console.log('options', options);
    }
    if (password !== undefined) {
      try {
        await decrypt({ file: file, password: password, outFile: options.outFile });
      } catch (e: unknown) {
        console.log(i18n['app.error.tip']);
        console.error(e);
      }
    }
  });

program.parse();
