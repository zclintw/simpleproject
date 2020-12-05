// eslint-disable-next-line
const debug = require('debug')('zc:routes:users');
const express = require('express');
const createError = require('http-errors');

module.exports = ({ commandUserService, queryUserService }) => {
  const router = express.Router();

  // create a user
  router.post('/', async (req, res, next) => {
    // TODO: use dto instead
    const { name = '', email = '' } = req.body;

    try {
      const data = await commandUserService.createUser({ name, email });

      return res.send({ data });
    } catch (err) {
      return next(createError(500, err.message));
    }
  });

  // get users
  router.get('/', async (req, res, next) => {
    try {
      const data = await queryUserService.getUsers();

      return res.send({ data });
    } catch (err) {
      return next(createError(500, err.message));
    }
  });

  return router;
};
