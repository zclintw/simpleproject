// eslint-disable-next-line
const debug = require('debug')('zc:eventbroker');
const R = require('ramda');

const EXPIRE_TIMER = 'ExpireTimer';
const KEYEVENT_EXPIRE_PATTERN = '__keyevent*__:expired';

class EventBroker {
  constructor({ redis }) {
    this.redis = redis;
  }

  /**
   *
   * @param {string} channel - notify channel
   * @param {string} message -
   * @param {integer} seconds -
   */
  async setExpireNotification(channel, message, seconds) {
    const redis = this.redis.getInstance();

    await redis.set(`${EXPIRE_TIMER}:${channel}:${message}`, 1, 'EX', seconds);
  }

  async removeExpireNotification(channel, message) {
    const redis = this.redis.getInstance();

    await redis.del(`${EXPIRE_TIMER}:${channel}:${message}`);
  }

  /**
   * receive expire key event then forward
   */
  async expireTimerEventHandler() {
    const sub = this.redis.getInstance();
    const pub = this.redis.getInstance();

    await sub.psubscribe(KEYEVENT_EXPIRE_PATTERN);

    sub.on('pmessage', async (pattern, channel, message) => {
      debug('pmessage', message);
      if (R.startsWith(EXPIRE_TIMER, message)) {
        const [, pubChannel, pubMessage] = R.split(':', message);

        await pub.publish(pubChannel, pubMessage);
      }
    });
  }

  // redis.on('message', (channel, message) => {})
  async subscribeChannel(channel) {
    const redis = this.redis.getInstance();
    await redis.subscribe(channel);
    return redis;
  }

  async publishToChannel(channel, message) {
    const redis = this.redis.getInstance();
    await redis.publish(channel, message);
  }
}

class Singleton {
  constructor() {
    throw new Error('Use Singleton.getInstance()');
  }

  static getInstance({ redis }) {
    if (!Singleton.instance) {
      Singleton.instance = new EventBroker({ redis });
      Singleton.instance.expireTimerEventHandler();
    }
    return Singleton.instance;
  }
}

module.exports = Singleton;
