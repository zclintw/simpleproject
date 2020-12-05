// eslint-disable-next-line
const debug = require('debug')('zc:QueryUserService');
const R = require('ramda');

class QueryUserService {
  constructor({ userModel, accessKey }) {
    this.userModel = userModel;
    this.accessKey = accessKey;
  }

  async getUserByAccessKeyId(accessKeyId) {
    const data = await this.userModel.getOneByAccessKeyId(accessKeyId);
    const { accessSecret } = data;
    const decrypted = this.accessKey.decryptSecret(accessSecret);

    return { ...data, accessSecret: decrypted };
  }

  async getUsers() {
    const data = await this.userModel.getAll();

    // do not return sensitive data
    // [{ id, name, email }]
    return R.map(R.pick(['id', 'name', 'email']), data);
  }
}

module.exports = QueryUserService;
