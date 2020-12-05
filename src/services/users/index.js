// eslint-disable-next-line
const debug = require('debug')('zc:services:users');
const DB = require('../../components/db');
const AccessKey = require('../../components/accesskey');
const UserModel = require('../../models/User');
const CommandUserService = require('./CommandUserService');
const QueryUserService = require('./QueryUserService');

const {
  postgres: dbOptions,
  secret: { passphrase, salt },
} = require('../../../config');

const db = new DB(dbOptions);
const accessKey = new AccessKey({ passphrase, salt });
const userModel = new UserModel(db);

const commandUserService = new CommandUserService({
  userModel,
  accessKey,
});

const queryUserService = new QueryUserService({
  userModel,
  accessKey,
});

module.exports = {
  commandUserService,
  queryUserService,
};
