// eslint-disable-next-line
const debug = require('debug')('zc:CommandTaskService');
const R = require('ramda');

const { CHANNEL, STATE } = require('./enum');

// FIXME: magic number
const EXPIRED_SECONDS = 86400;

class CommandTaskService {
  constructor({ taskModel, eventBroker }) {
    this.taskModel = taskModel;
    this.eventBroker = eventBroker;
  }

  async createTask({ creator }) {
    const data = await this.taskModel.create({ creator });
    const { id } = data;
    // FIXME: magic number
    await this.eventBroker.setExpireNotification(CHANNEL.EXPIRED, id, EXPIRED_SECONDS);

    // { id, creator, state }
    return data;
  }

  async approveTask(id) {
    const data = await this.taskModel.getOneById(id);
    if (R.isNil(data)) {
      // TODO: components/errors
      const error = new Error(`the task id ${id} not found`);
      error.name = 'NotFound';

      throw error;
    }

    // TODO: check current state?
    await this.taskModel.updateState(id, STATE.APPROVED);
    await this.eventBroker.publishToChannel(CHANNEL.APPROVED, id);

    return { id };
  }

  async taskCompleted(id) {
    // first remove timer then update state
    await this.eventBroker.removeExpireNotification(STATE.EXPIRED, id);
    await this.taskModel.updateState(id, STATE.COMPLETED);
  }

  async taskExpired(id) {
    await this.taskModel.updateState(id, STATE.EXPIRED);
  }
}

module.exports = CommandTaskService;
