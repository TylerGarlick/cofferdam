'use strict';

var Client = require('./client');

class AbstactClientBasedHelper {
  constructor() {
    this.client = new Client();
  }
}

module.exports = AbstactClientBasedHelper;