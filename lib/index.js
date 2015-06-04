'use strict';

var Promise = require('bluebird');
var DocumentDBClient = require('documentdb').DocumentClient;
var DatabaseClient = require('./clients/database');

Promise.promisifyAll(DocumentDBClient);

/**
 * Cofferdam Client
 *
 * @public
 * @constructor
 * @param {string} host - the uri of the DocumentDB host
 * @param {string} key - the DocumentDB key
 * @param {string} dbName - the name of the db to connect to
 */
function Cofferdam(host, key, dbName) {
  this.host = host;
  this.dbName = dbName;
  this.client = Promise.promisifyAll(new DocumentDBClient(host, { masterKey: key }));

  this.clients = {
    database: new DatabaseClient(this.client)
  };

}

/**
 * Creates a new instance of Cofferdam
 * @public
 * @static
 * @param {string} host - the uri of the DocumentDB host
 * @param {string} key - the key of the DocumentDB instance
 * @param {string} database - the name of the db to connect to
 * @returns {Cofferdam}
 */
Cofferdam.connect = function(host, key, database) {
  return new Cofferdam(host, key, database);
};

Cofferdam.prototype.initialize = function() {

};

module.exports = Cofferdam;
