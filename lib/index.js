'use strict';

var Promise = require('bluebird');
var DocumentDBClient = require('documentdb').DocumentClient;

Promise.promisifyAll(DocumentDBClient);

/**
 * Cofferdam
 * @class Cofferdam
 */
class Cofferdam {

  /**
   * @public
   * @constructor
   * @param host
   * @param key
   */
  constructor(host, key) {
    this.host = host;
    this.key = key;
    this.client = Promise.promisifyAll(new DocumentDBClient(this.host, { masterKey: key }));
  }

  /**
   * Connect
   * @param name
   * @returns {bluebird|exports|module.exports}
   */
  connect(name) {
    this.name = name;
    return new Promise((resolve, reject) => {

    });
  }
}

module.exports = Cofferdam;

