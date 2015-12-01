'use strict';

import Client from './client';
import Lazy from 'lazy.js';

const client = Symbol('client');
const baseQuery = 'SELECT * FROM root r';
const options = { maxItemCount: 1000 };

export var MultipleDocumentsError = class extends Error {
  constructor(message) {
    super(message);
  }
};

export var DocumentNotFound = class extends Error {
  constructor(message) {
    super(message);
  }
};

export default class Document {

  async all(collection, feedOptions = options) {
    return await new Promise((reject, resolve) => {
      this[client].readDocuments(collection, feedOptions)
        .toArray((err, results = []) => {
          if (err) return reject(err);
          return resolve(Lazy(results));
        });
    });
  }

  async findById(collection, id, options = {}) {
    return await this.one(collection, {
      query: `${baseQuery} WHERE r.id = @id`,
      parameters: [{ name: '@id', value: id }]
    });
  }

  async find(collection, query, feedOptions = options) {
    return await new Promise((reject, resolve) => {
      this[client].queryDocuments(collection, query, feedOptions)
        .toArray((err, results = []) => {
          if (err) return reject(err);
          return resolve(Lazy(results));
        });
    });
  }

  async first(collection, query) {
    let results = await this.find(collection, query);
    return await results.first();
  }

  async last(collection, query) {
    let results = await this.find(collection, query);
    return await results.first();
  }

  async one(collection, query, options = { allowMultiple: false }) {
    let results = await this.find(collection, query) || [];
    if (results.length === 1) return await results.first();
    else {
      if (options.allowMultiple) return await results.first();

    }

    if (options.allowMultiple && results.length > 0) return await results.first();

    throw new MultipleDocumentsError(`Results had ${results.length} and allowMultiple was false`);
  }

  async get(documentLink, requestOptions = {}) {
    return await new Promise((reject, resolve) => {
      this[client].readDocument(documentLink, requestOptions, (err, resource, headers) => {
        if (err) return reject(err);
        return resolve({ resource, headers });
      });
    });
  }

  async create(collection, doc, requestOptions = {}) {
    return await new Promise((reject, resolve) => {
      this[client].createDocument(collection, doc, requestOptions, (err, resource, headers) => {
        if (err) return reject(err);
        return resolve({ resource, headers });
      });
    });
  }

  async update(documentLink, doc, options = {}) {
    return await new Promise((resolve, reject) => {
      this[client].replaceDocument(documentLink, doc, options, (err, resource, headers) => {
        if (err) return reject(err);
        return resolve({ resource, headers });
      });
    });
  }

  async upsert(collection, doc, options = {}) {
    return await new Promise((reject, resolve) => {
      this[client].upsertDocument(collection, doc, options, (err, resource, headers) => {
        if (err) return reject(err);
        return resolve({ resource, headers });
      })
    });
  }

  async remove(documentLink, options = {}) {
    return await new Promise((reject, resolve) => {
      this[client].deleteDocument(documentLink, options, (err, resource, headers) => {
        if (err) return reject(err);
        return resolve({ resource, headers });
      });
    });
  }

  async removeById(collection, id) {
    let document = await this.findById(collection, id);
    if (!document) throw new DocumentNotFound(`Document in collection ${collection} with id ${id} was not found`);
    return await remove(document._self);
  }
}
