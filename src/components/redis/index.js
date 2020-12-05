const IORedis = require('ioredis');

class Redis {
  constructor(options) {
    this.options = options;
  }

  getInstance() {
    return new IORedis(this.options);
  }
}

module.exports = Redis;
