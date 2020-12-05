// eslint-disable-next-line
const debug = require('debug')('zc:model:User');
const R = require('ramda');

class UserModel {
  constructor(db) {
    this.db = db;
  }

  async create({
    name, email, accessKeyId, accessSecret,
  }) {
    const text = `
    INSERT INTO users("name", "email", "accessKeyId", "accessSecret")
    VALUES($1, $2, $3, $4) RETURNING *
    `;
    const params = [name, email, accessKeyId, accessSecret];

    const res = await this.db.query(text, params);

    return res.rows[0];
  }

  async getOneByAccessKeyId(accessKeyId) {
    const text = `
    SELECT * FROM users
    WHERE "accessKeyId" = $1
    `;
    const params = [accessKeyId];

    const res = await this.db.query(text, params);

    if (R.isEmpty(res.rows)) {
      return null;
    }

    return res.rows[0];
  }

  async getAll() {
    const text = `
    SELECT * FROM users
    ORDER BY "id" ASC
    `;

    const res = await this.db.query(text);

    return res.rows;
  }
}

module.exports = UserModel;
