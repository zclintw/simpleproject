const debug = require('debug')('zc:task:worker');
const bluebird = require('bluebird');
const crypto = require('crypto');
const { CHANNEL } = require('./enum');

class Worker {
  constructor({ commandTaskService, eventBroker }) {
    this.commandTaskService = commandTaskService;
    this.eventBroker = eventBroker;
  }

  async start() {
    // TODO: should use redis stream instead
    const subApproved = await this.eventBroker.subscribeChannel(CHANNEL.APPROVED);

    // use async function let event-loop work
    // or we can dispatch it to other worker
    subApproved.on('message', async (channel, message) => {
      debug('approved', { channel, message });
      const id = parseInt(message, 10);
      const randomInt = crypto.randomInt(1, 10);
      debug(`${id} running ${randomInt} seconds`);

      await bluebird.delay(randomInt * 1000);
      this.commandTaskService.taskCompleted(id);
      debug('complete', id);
    });

    const subExpired = await this.eventBroker.subscribeChannel(CHANNEL.EXPIRED);
    subExpired.on('message', (channel, message) => {
      debug('expired', { channel, message });
      const id = parseInt(message, 10);

      this.commandTaskService.taskExpired(id);
    });
  }
}

module.exports = Worker;
