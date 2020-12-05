const crypto = require('crypto');
const cryptoRandomString = require('crypto-random-string');

class AccessKey {
  constructor({ passphrase, salt }) {
    this.passphrase = passphrase;
    this.salt = salt;
  }

  generate() {
    return {
      accessKeyId: cryptoRandomString({ length: 10, type: 'alphanumeric' }),
      accessSecret: cryptoRandomString({ length: 16, type: 'url-safe' }),
    };
  }

  encryptSecret(secret) {
    const algorithm = 'aes-192-cbc';
    const key = crypto.scryptSync(this.passphrase, this.salt, 24);
    const iv = Buffer.alloc(16, 0);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
  }

  decryptSecret(encrypted) {
    const algorithm = 'aes-192-cbc';
    const key = crypto.scryptSync(this.passphrase, this.salt, 24);
    const iv = Buffer.alloc(16, 0);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

module.exports = AccessKey;
