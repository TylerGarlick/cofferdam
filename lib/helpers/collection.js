'use strict';

var Promise = require('bluebird');
var AbstractHelper = require('./abstract');
var Lazy = require('lazy.js');

class Collection extends AbstractHelper {
  constructor(databaseLink) {
    super();
    this.baseQuery = 'SELECT * FROM root r';
    this.databaseLink = databaseLink;
  }

  all() {
    let client = this.client
      , link = this.databaseLink;
    return new Promise((resolve, reject) => {
      client.readCollections(link).toArray((err, results) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(results);
        }
      });
    });
  }

  byId(id) {
    let queryDefinition = {
      query: this.baseQuery + ' WHERE r.id = @id',
      parameters: [{ name: '@id', value: id }]
    };
    return Promise.resolve(this.find(queryDefinition))
      .then((results) => {
        results = Lazy(results || []);
        return results.first();
      });
  }

  find(queryDefinition) {
    let client = this.client
      , link = this.databaseLink;
    return new Promise((resolve, reject) => {
      client.queryCollections(link, queryDefinition).toArray((err, results) => {
        results = Lazy(results || []);
        if (err) {
          return reject(err);
        } else {
          return resolve(results);
        }
      });
    });
  }

  create(id) {
    let client = this.client
      , link = this.databaseLink;
    return new Promise((resolve, reject) => {
      client.createCollection(link, { id }, (err, result) => {
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
    return self.byId(id)
      .then((result) => {
        if (!result) {
          return self.create(id);
        } else {
          return result;
        }
      })
  }

  delete(id) {
    let client = this.client;
    return this.byId(id)
      .then((result) => {
        if (result) {
          return new Promise((resolve, reject) => {
            client.deleteCollection(result._self, (err) => {
              if (err) {
                return reject(err);
              } else {
                return resolve();
              }
            });
          });
        }
      });
  }
}

module.exports = Collection;