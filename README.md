# LitAes

A cli tool to help encrypt and decrypt your data using aes-256.

# 安装方法

```sh
npm i -g litaes
```

# 使用方法

```sh
# 加密文件 加密后同目录下生成文件 file_to_encrypt.tar.Lit
litaes e file_to_encrypt.tar password
litaes encrypt file_to_encrypt.tar password
# 解密文件 解密后生成同名不同后缀文件 file_to_decrypt.tar.Til，你可以手动删除 .Til 后缀
litaes d file_to_decrypt.tar.Lit password
litaes decrypt file_to_decrypt.tar.Lit password
```
