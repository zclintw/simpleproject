require('dotenv').config();
const nconf = require('nconf');

nconf
  .argv()
  .env();

const web = {
  port: nconf.get('WEB_PORT'),
  httpsKey: nconf.get('HTTPS_KEY'),
  httpsCert: nconf.get('HTTPS_CERT'),
};

const redis = {
  host: nconf.get('REDIS_HOST'),
  port: nconf.get('REDIS_PORT'),
  password: nconf.get('REDIS_PASSWORD'),
};

const postgres = {
  host: nconf.get('POSTGRES_HOST'),
  port: nconf.get('POSTGRES_PORT'),
  user: nconf.get('POSTGRES_USER'),
  password: nconf.get('POSTGRES_PASSWORD'),
  database: nconf.get('POSTGRES_DB'),
};

const secret = {
  passphrase: nconf.get('SECRET_PASSPHRASE'),
  salt: nconf.get('SECRET_SALT'),
  // for dev only
  accessKeyId: nconf.get('ACCESS_KEY_ID'),
  accessSecret: nconf.get('ACCESS_SECRET'),
};

module.exports = {
  web,
  redis,
  postgres,
  secret,
};
