'use strict';

import Client from './client';

const client = Symbol('client');
const baseQuery = 'SELECT * FROM root r';

export var DatabaseNotFound = class extends Error {
  constructor(message) {
    super(message);
  }
};

export default class Database {

  constructor(uri, key) {
    this[client] = new Client(uri, key);
  }

  async all() {
    return await new Promise((resolve, reject) => {
      this[client].readDatabases()
        .toArray((err, databases) => {
          if (err) return reject(err);
          return resolve(databases);
        })
    });
  }

  async findById(id) {
    const spec = {
      query: `${baseQuery} WHERE r.id = @id`,
      parameters: [{ name: '@id', value: id }]
    };

    return await this.find(spec);
  }

  async find(querySpec = {}) {
    return await new Promise((resolve, reject) => {
      this[client].queryDatabases(querySpec).toArray((err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  }

  async findOrCreate(id) {
    let db = await this.findById(id);
    if (db) return await db;
    return await this.create(id);
  }

  async create(id) {
    return await new Promise((resolve, reject) => {
      this[client].createDatabase({ id: id }, (err, result) => {
        if (err)  return reject(err);
        return resolve(result);
      });
    });
  }

  async remove(id) {
    return await new Promise((resolve, reject) => {
      let db = this.findById(id);
      if (!db) throw new DatabaseNotFound(`Database ${id} not found`);

      client.deleteDatabase(db._self, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }

}
