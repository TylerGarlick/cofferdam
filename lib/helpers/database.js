'use strict';

var Promise = require('bluebird');
var AbstractHelper = require('./abstract');
var Lazy = require('lazy.js');


class Database extends AbstractHelper {
  constructor() {
    super();
    this.baseQuery = 'SELECT * FROM root r';
  }

  all() {
    let client = this.client;
    return new Promise((resolve, reject) => {
      client.readDatabases().toArray((err, databases) => {
        databases = databases || [];
        if (err) return reject(err);
        return resolve(databases);
      });
    });
  }

  byId(id) {
    let queryDefinition = {
      query: this.baseQuery + ' WHERE r.id = @id',
      parameters: [{ name: '@id', value: id }]
    };
    return Promise.resolve(this.find(queryDefinition))
      .then((databases) => {
        databases = Lazy(databases || []);
        return databases.first();
      });
  }

  find(queryDefinition) {
    let client = this.client;
    return new Promise((resolve, reject) => {
      client.queryDatabases(queryDefinition).toArray((err, databases) => {
        if (err) return reject(err);
        return resolve(databases);
      });
    });
  }


  create(id) {
    let client = this.client;
    return new Promise((resolve, reject) => {
      client.createDatabase({ id: id }, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  }

  findOrCreate(id) {
    let self = this;
    return this.byId(id)
      .then((db) => {
        if (!db) {
          return self.create(id);
        } else {
          return Promise.resolve(db);
        }
      });
  }

  drop(id) {
    let client = this.client;
    return this.byId(id)
      .then((db) => {
        if (db) return client.deleteDatabaseAsync(db._self);
        return Promise.resolve(db);
      });
  }

}

module.exports = Database;