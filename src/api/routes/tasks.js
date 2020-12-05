const debug = require('debug')('zc:routes:tasks');
const createError = require('http-errors');
const express = require('express');
const R = require('ramda');

module.exports = ({ queryTaskService, commandTaskService }) => {
  const router = express.Router();

  /**
   * get tasks
   * support query
   * - email
   */
  router.get('/', async (req, res, next) => {
    try {
      const creator = R.propOr('', 'email', req.query);
      let data;

      if (R.not(R.isEmpty(creator))) {
        data = await queryTaskService.getTasksByCreator(creator);
      } else {
        data = await queryTaskService.getTasks();
      }

      return res.send({ data });
    } catch (err) {
      return next(createError(500, err.message));
    }
  });

  // create a task
  router.post('/', async (req, res, next) => {
    const creator = R.pathOr('', ['user', 'email'], res.locals);

    try {
      const data = await commandTaskService.createTask({ creator });

      return res.send({ data });
    } catch (err) {
      return next(createError(500, err.message));
    }
  });

  // approve a task
  router.post('/:id/approved', async (req, res, next) => {
    const { id } = req.params;

    try {
      const data = await commandTaskService.approveTask(id);

      return res.send({ data });
    } catch (err) {
      if (err.name === 'NotFound') {
        return next(createError(404, err.message));
      }

      return next(createError(500, err.message));
    }
  });

  // get a task
  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      const data = await queryTaskService.getTaskById(id);

      return res.send({ data });
    } catch (err) {
      return next(createError(500, err.message));
    }
  });

  return router;
};
