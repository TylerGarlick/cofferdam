'use strict';

var Promise = require('bluebird');
var lazy = require('lazy.js');
var utils = require('../utils');
var asyncify = utils.iterators.asyncify;

/**
 * Abstract on DocumentDB client to setup the document
 * @param {DocumentClient} client -the DocumentDB client
 * @param {string} id - the databases name
 * @constructor
 */
function DatabaseClient(client) {
  this.baseQuery = 'SELECT * FROM root r';
  this.client = client;
}

DatabaseClient.prototype.findById = function(id) {
  var queryDefinition = {
    query: this.baseQuery + ' WHERE r.id = @id',
    parameters: [
      { name: '@id', value: id }
    ]
  };

  return asyncify(this.client.queryDatabases(queryDefinition))
    .then(function(results) {
      results = lazy(results);
      if (!results.isEmpty()) return results.first();
      return Promise.resolve(null);
    });
};

DatabaseClient.prototype.create = function(id) {
  return this.client.createDatabaseAsync({ id: id });
};

DatabaseClient.prototype.findOrCreate = function(id) {
  var self = this;
  return this.findById(id)
    .then(function(database) {
      if (!database) {
        return self.create(id);
      }
      return database;
    })
    .then(function(database) {
      DatabaseClient._database = database;
      return database;
    });
};

DatabaseClient.prototype.remove = function(id) {
  var self = this;
  return this.findById(id)
    .then(function(database) {
      if (database) {
        return self.client.deleteDatabaseAsync(database._self);
      }
      return database;
    });
};

module.exports = DatabaseClient;
