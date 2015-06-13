'use strict';

class CofferdamConfiguration {

  static get current() {
    return {
      uri: this._uri || process.env.COFFERDAM_DOCUMENTDB_URI,
      key: this._key || process.env.COFFERDAM_DOCUMENTDB_KEY,
      db: this._db || process.env.COFFERDAM_DOCUMENTDB_DB
    }
  }

  static initialize(uri, key, db) {
    this._uri = uri || process.env.COFFERDAM_DOCUMENTDB_URI;
    this._key = key || process.env.COFFERDAM_DOCUMENTDB_KEY;
    this._db = db || process.env.COFFERDAM_DOCUMENTDB_DB;
  }

}

module.exports = CofferdamConfiguration;