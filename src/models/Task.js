// eslint-disable-next-line
const debug = require('debug')('zc:model:Task');
const R = require('ramda');

class TaskModel {
  constructor(db) {
    this.db = db;
  }

  async create({ creator }) {
    const text = `
    INSERT INTO tasks("creator")
    VALUES($1) RETURNING *
    `;
    const params = [creator];

    const res = await this.db.query(text, params);

    return res.rows[0];
  }

  async getOneById(id) {
    const text = `
    SELECT * FROM tasks
    WHERE "id" = $1
    `;
    const params = [id];

    const res = await this.db.query(text, params);

    if (R.isEmpty(res.rows)) {
      return null;
    }

    return res.rows[0];
  }

  async getAll() {
    const text = `
    SELECT * FROM tasks
    ORDER BY "id" ASC, "state" ASC
    `;

    const res = await this.db.query(text);

    return res.rows;
  }

  async getAllByCreator(creator) {
    const text = `
    SELECT * FROM tasks
    WHERE "creator" = $1
    ORDER BY "state" ASC
    `;
    const params = [creator];

    const res = await this.db.query(text, params);

    return res.rows;
  }

  async updateState(id, state) {
    const text = `
    UPDATE "tasks"
    SET "state"=$2
    WHERE "id"=$1
    RETURNING *;
    `;
    const params = [id, state];

    const res = await this.db.query(text, params);

    return res.rows;
  }
}

module.exports = TaskModel;
