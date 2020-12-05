// eslint-disable-next-line
const debug = require('debug')('zc:QueryTaskService');
class QueryTaskService {
  constructor({ taskModel }) {
    this.taskModel = taskModel;
  }

  async getTasks() {
    const data = await this.taskModel.getAll();

    // [{ id, creator, state }]
    return data;
  }

  async getTasksByCreator(creator) {
    const data = await this.taskModel.getAllByCreator(creator);

    // [{ id, creator, state }]
    return data;
  }

  async getTaskById(id) {
    const data = await this.taskModel.getOneById(id);

    // { id, creator, state }
    return data;
  }
}

module.exports = QueryTaskService;
