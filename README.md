# LitAes

A tool to help encrypt and decrypt your data using AES-256 algorithm.

And it could be also used as an library.

# Install

```sh
npm i -g litaes
```

# Usage

## Encrypt File

```shell
# Encrypt File
## This will generate encrypted file in the same directory of origin file.
## The encrypted file's format is `Lit`.
## So `abc.zip` will be `abc.zip.Lit` after encryption.
litaes e file_to_encrypt password
litaes encrypt file_to_encrypt password
litaes e file_to_encrypt -p [password]
litaes encrypt file_to_encrypt -p [password]
litaes e file_to_encrypt --password [password]
litaes encrypt file_to_encrypt --password [password]
### The command could be `e` or `encrypt`, they are same.
### `-p` is an alias of `--password`, and
### `-p` is optional for providing password.
### But if you want input your password, keep `-p` empty.
```

## Decrypt File

**This tool can only decrypt files encrypted by this tool.**

```shell
# Decrypt File
## This will generate decrypted file in the same directory of origin file.
## The decrypted file's format is `Til`.
## For example, `abc.zip.Lit` will be decrypted to `abc.zip.Til`.
## Why not just `abc.zip`? Because you may perform decryption in the same directory.
litaes d file_to_decrypt password
litaes decrypt file_to_decrypt password
litaes d file_to_decrypt -p [password]
litaes decrypt file_to_decrypt -p [password]
litaes d file_to_decrypt --password [password]
litaes decrypt file_to_decrypt --password [password]
### Just like in `Encrypt File`,
### The command could be `e` or `encrypt`, they are same.
### `-p` is an alias of `--password`, and
### `-p` is optional for providing password.
### But if you want input your password, keep `-p` empty.
```

## Additional

### About Password

If you want to supply your password from environment variables.

There is a way to do that. `LITAES_PASSWORD`, keep it uppercase.

```powershell
# example in powershell
$env:LITAES_PASSWORD='password'
```

And the priority is

`command plain password` > `-p, --password` > `LITAES_PASSWORD`

### Other Information

You could just run `litaes -h` to get more infomation.
