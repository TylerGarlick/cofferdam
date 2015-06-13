'use strict';

var Lazy = require('lazy.js');
var cofferdam = require('../');
let config = require('../lib/config');
var expect = require('chai').expect;
var Database = require('../lib/helpers/database');

describe('Cofferdam', () => {

  describe('Configuration', () => {

    after(() => {
      config.initialize(process.env.COFFERDAM_DOCUMENTDB_URI, process.env.COFFERDAM_DOCUMENTDB_KEY, process.env.COFFERDAM_DOCUMENTDB_DB);
    });

    it('should be set with environment vars', () => {
      expect(config.current.uri).to.be.eql(process.env.COFFERDAM_DOCUMENTDB_URI);
      expect(config.current.key).to.be.eql(process.env.COFFERDAM_DOCUMENTDB_KEY);
      expect(config.current.db).to.be.eql(process.env.COFFERDAM_DOCUMENTDB_DB);
    });

    it('should be able to store initialization values', () => {
      const uri = 'http://my.url';
      const key = 'my-key';
      const db = 'my-db';
      config.initialize(uri, key, db);

      expect(config.current.uri).to.be.eql(uri);
      expect(config.current.key).to.be.eql(key);
      expect(config.current.db).to.be.eql(db);
    });

  });

  describe('Databases', () => {

    var database;
    before(() => {
      database = new Database();
      expect(database).to.be.ok;
    });

    describe('querying', () => {
      const id = 'cofferdam-tests';

      beforeEach((done) => {
        database.findOrCreate(id)
          .then((db) => {
            expect(db).to.be.ok;
            done();
          })
          .catch(done);
      });

      it('should be able to list all databases', (done) => {
        database.all()
          .then((databases) => {
            expect(databases).to.not.be.empty;
            done();
          })
          .catch((err) => {
            console.log(err);
            done(err);
          });
      });

      it('should be able to get a single known database', (done) => {
        database.byId(id)
          .then((db) => {
            expect(db.id).to.be.eql(id);
            done();
          })
          .catch((err) => {
            console.log(err);
            done(err);
          });
      });
    });

    describe('operations', () => {
      const id = 'cofferdam-tests';

      before((done) => {
        database.byId(id)
          .then(function(db) {
            if (db) {
              return database.drop(id)
                .then(() => {
                  done();
                });
            } else {
              return done();
            }
          }).catch(done);
      });

      it('should be able to findOrCreate a database', (done) => {
        database.findOrCreate(id)
          .then(function(db) {
            console.log(db);
            expect(db.id).to.be.eql(id);
            done();
          })
          .catch(done);
      });

    });

  });

});

