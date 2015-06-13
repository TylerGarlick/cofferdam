'use strict';

var Promise = require('bluebird');
var AbstractHelper = require('./abstract');
var Lazy = require('lazy.js');

class Document extends AbstractHelper {
  constructor(collectionLink) {
    super();
    this.collectionLink = collectionLink;
  }

  all(feedOptions) {
    let client = this.client
      , link = this.collectionLink;

    feedOptions = feedOptions || {};
    return new Promise((resolve, reject) => {
      client.readDocuments(link, feedOptions).toArray((err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  }


  find(queryDefinition, feedOptions) {
    let client = this.client
      , link = this.collectionLink;

    feedOptions = feedOptions || {};
    return new Promise((resolve, reject) => {
      client.queryDocuments(link, queryDefinition, feedOptions).toArray((err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  }

  one(queryDefinition) {
    return this.find(queryDefinition)
      .then((results) => {
        results = Lazy(results || []);
        return results.first();
      });
  }

  lastOne(queryDefinition) {
    return this.find(queryDefinition)
      .then((results) => {
        results = Lazy(results || []);
        return results.last();
      });
  }

  create(doc, options) {

  }

  update(link, doc, options) {

  }

  remove(link) {

  }
}

module.exports = Document;