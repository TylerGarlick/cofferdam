'use strict';

var Promise = require('bluebird');
var lazy = require('lazy.js');
var utils = require('../utils');
var asyncify = utils.iterators.asyncify;


/**
 * Collection client
 * @constructor
 * @public
 * @param {DocumentDBClient} client
 */
function CollectionClient(client) {
  this.baseQuery = 'SELECT * FROM root r';
  this.client = client;
}

CollectionClient.prototype.all = function(database) {
  asyncify(this.client.readCollections()).toArrayAsync();
};


CollectionClient.prototype.findById = function(id, database) {
  var queryDefinition = {
    query: this.baseQuery + ' WHERE r.id = @id',
    parameters: [
      { name: '@id', value: id }
    ]
  };
  return asyncify(this.client.queryCollections(queryDefinition))
    .then(function(results) {
      results = lazy(results);
      if (!results.isEmpty()) return results.first();
      return Promise.resolve(null);
    });
};

CollectionClient.prototype.create = function(id, database) {
  return this.client.createCollectionAsync(database._self, { id: id });
};

CollectionClient.prototype.findOrCreate = function(id, database) {
  var self = this;
  return this.findById(id, database)
    .then(function(collection) {
      if (!collection) {
        return self.create(id, database);
      }
      return collection;
    });
};

module.exports = CollectionClient;
