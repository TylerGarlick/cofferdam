'use strict';

var Promise = require('bluebird');
var Configuration = require('../config');
var DocumentClient = require('documentdb').DocumentClient;
var Assert = require('assert-plus');

Promise.promisifyAll(DocumentClient);

class Client {
  constructor() {
    let host = Configuration.current.uri;
    let masterKey = Configuration.current.key;

    Assert.string(host, 'Config.current.uri');
    Assert.string(masterKey, 'Config.current.key');

    return Promise.promisifyAll(new DocumentClient(host, { masterKey }));
  }
}

module.exports = Client;