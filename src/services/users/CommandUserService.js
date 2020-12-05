// eslint-disable-next-line
const debug = require('debug')('zc:CommandUserService');
class CommandUserService {
  constructor({ userModel, accessKey }) {
    this.userModel = userModel;
    this.accessKey = accessKey;
  }

  async createUser(user) {
    const { accessKeyId, accessSecret } = this.accessKey.generate();

    const encrypted = this.accessKey.encryptSecret(accessSecret);

    const data = await this.userModel.create({
      accessKeyId,
      accessSecret: encrypted,
      ...user,
    });

    // { id, name, email, accessKeyId, accessSecret }
    return { ...data, accessSecret };
  }
}

module.exports = CommandUserService;
