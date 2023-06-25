# LitAes

A cli tool to help encrypt and decrypt your data using aes-256.

# Install

```sh
npm i -g litaes
```

# Usage

## Encrypt file

```sh
# Encrypted file.
# Generate files in the same directory after encryption: `file_to_encrypt.tar.Lit`
# yeah, the default file format of this tools is that I give it `Lit`
litaes e file_to_encrypt.tar password
litaes encrypt file_to_encrypt.tar password
litaes e file_to_encrypt.tar -p [password] # or left it blank then you can input your password
# or you can set password in environment variable `LITAES_PASSWORD`
# example in powershell
$env:LITAES_PASSWORD='password'
litaes e file_to_encrypt.tar
# command plain password > -p, --password > environment variable
```

## Decrypt file

This tool can only decrypt files encrypted by this tool.

```sh
# Decrypted files Generate files with the same name and different suffixes after decryption
# What I use is Til
# So example file will be decrypted to file `file_to_encrypt.tar.Til`
# yeah, I have not store origin format in the encrypted file, and I think it is not a issue to use.
# maybe someday I will tied the format info to the encrypted file, but now it is nothing.
litaes d file_to_encrypt.tar.Lit password
litaes decrypt file_to_encrypt.tar.Lit password
litaes d file_to_encrypt.tar.Lit -p [password] # or left it blank then you can input your password
# or you can set password in environment variable `LITAES_PASSWORD`
# example in powershell
$env:LITAES_PASSWORD='password'
litaes d file_to_encrypt.tar.Lit
# command plain password > -p, --password > environment variable
```
