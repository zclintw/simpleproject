const AccessKey = require('./index');

const accessKey = new AccessKey({
  passphrase: 'just a test',
  salt: 'salt',
});

describe('AccessKey Module', () => {
  test('generate', () => {
    const { accessKeyId, accessSecret } = accessKey.generate();
    expect(accessKeyId.length).toBe(10);
    expect(accessSecret.length).toBe(16);
  });

  test('encrypt and decrypt', () => {
    const secret = 'just a test';

    const encrypted = accessKey.encryptSecret(secret);
    const decrypted = accessKey.decryptSecret(encrypted);

    expect(encrypted).not.toBe(secret);
    expect(decrypted).toBe(secret);
  });
});
