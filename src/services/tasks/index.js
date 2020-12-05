// eslint-disable-next-line
const debug = require('debug')('zc:svc:tasks');
const DB = require('../../components/db');
const TaskModel = require('../../models/Task');
const CommandTaskService = require('./CommandTaskService');
const QueryTaskService = require('./QueryTaskService');
const EventBroker = require('../../components/eventbroker');
const Redis = require('../../components/redis');
const Worker = require('./Worker');

const {
  postgres: dbOptions,
  redis: redisOptions,
} = require('../../../config');

const db = new DB(dbOptions);
const redis = new Redis(redisOptions);
const taskModel = new TaskModel(db);

const eventBroker = EventBroker.getInstance({ redis });

const commandTaskService = new CommandTaskService({
  taskModel,
  eventBroker,
});

const queryTaskService = new QueryTaskService({
  taskModel,
});

const worker = new Worker({
  commandTaskService,
  eventBroker,
});
worker.start();

module.exports = {
  commandTaskService,
  queryTaskService,
};
