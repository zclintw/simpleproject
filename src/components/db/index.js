// eslint-disable-next-line
const debug = require('debug')('zc:db');
const { Pool } = require('pg');

class DB {
  constructor(options) {
    this.pool = new Pool(options);
  }

  query(text, params) {
    return this.pool.query(text, params);
  }
}

module.exports = DB;
