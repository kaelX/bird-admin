const RsaPublicKey = `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoWV4mJJkGVaeOYKC2sGY\nORVubiPQLl/rEvcPIHB3HWSyaydPih5t8kZVGYPYA74erhjVsw4FxJg/9WD+ENDA\naX/aK1QVWEXR/oExvvYG8tDfJh04OaCI71vdJ0FPl/lC21Nvn/Pq0UlOc1YLX5dM\nv4Qf5D/1r9t4om6K7wBJdU1IADfX62tzpfJfxVCVY1AUJFFDsvLK5w+IhC2K5LUv\nmAH/zGGc5rwbLF4jy3y8NcCqJVlYnbClK5DjGoRVWz4S7UCeBE2T+y6SFMwGbowa\nMdeln7JR0AVhfUsp6Bhri4K6A+IN5OBCzEHSLjeJjyD9C9jw6ECHAK3tWgJ+95oN\n6wIDAQAB\n-----END PUBLIC KEY-----\n`
let forge = require('node-forge')
const aesKey = forge.random.getBytesSync(32)
const aesIv = forge.random.getBytesSync(16)

export const base64Encode = (text) => {
  return forge.util.encode64(text)
}

export const rsaEncrypt = (text) => {
  var pki = forge.pki
  var publicKey = pki.publicKeyFromPem(RsaPublicKey)
  return base64Encode(publicKey.encrypt(text))
}

export const aesEncryptWithRandomKey = (text) => {
  var key = forge.random.getBytesSync(32)
  var iv = forge.random.getBytesSync(16)
  var cipher = forge.cipher.createCipher('AES-CBC', key)
  cipher.start({iv: iv})
  cipher.update(forge.util.createBuffer(text))
  cipher.finish()
  key = base64Encode(key)
  iv = base64Encode(iv)
  var data = base64Encode(cipher.output.data)
  var result = {aes_key: key, aes_iv: iv, data: data}
  return JSON.stringify(result)
}

export const aesEncryptWithGivenKey = (text) => {
  var cipher = forge.cipher.createCipher('AES-CBC', aesKey)
  cipher.start({iv: aesIv})
  cipher.update(forge.util.createBuffer(text))
  cipher.finish()
  var key = base64Encode(aesKey)
  var iv = base64Encode(aesIv)
  var data = base64Encode(cipher.output.data)
  var result = {aes_key: key, aes_iv: iv, data: data}
  return JSON.stringify(result)
}
