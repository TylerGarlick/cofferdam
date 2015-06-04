'use strict';

var Promise = require('bluebird');

/**
 * Helper to turn a QueryIterator to a promise
 */
module.exports.asyncify = function(iterator) {
  return Promise.promisifyAll(iterator).toArrayAsync();
};
