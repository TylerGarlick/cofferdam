'use strict';

import Client from './client';
import Lazy from 'lazy.js';

const client = Symbol('client');
const baseQuery = 'SELECT * FROM root r';

export var CollectionNotFound = class extends Error {
  constructor(message) {
    super(message);
  }
};

export default class Collection {

  constructor(uri, key, db) {
    this[client] = new Client(uri, key);
    this.db = db;
  }

  async all() {
    return await new Promise((reject, resolve) => {
      this[client].readCollections(this.db).toArray((err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  }

  async findById(id) {
    const spec = {
      query: this.baseQuery + ' WHERE r.id = @id',
      parameters: [{ name: '@id', value: id }]
    };
    return await this.find(this.db, spec);
  }

  async find(querySpec = {}) {
    return await new Promise((reject, resolve) => {
      this[client].queryCollections(this.db, querySpec).toArray((err, results = []) => {
        if (err) return reject(err);
        return resolve(Lazy(results));
      });
    });
  }

  async create(id) {
    return await new Promise((resolve, reject) => {
      this[client].createCollection(this.db, { id }, (err, result) => {
        if (err)  return reject(err);
        return resolve(result);
      });
    });
  }

  async findOrCreate(id) {
    let collection = await this.findById(this.db, id);
    if (!collection) return await this.create(this.db, id);
    return await collection;
  }

  async remove(id) {
    let collection = this.findById(this.db, id);
    if (!collection) throw new CollectionNotFound(`Collection ${id} was not found`);
    return await new Promise((resolve, reject) => {
      this[client].deleteCollection(collection._self, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }
}
