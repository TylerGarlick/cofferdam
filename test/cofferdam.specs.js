'use strict';

var cofferdam = require('../');
var DatabaseClient = require('../lib/clients/database');

var uri = global.uri;
var key = global.key;
var db = global.db;

describe('Cofferdam', function() {

  var coffer;
  before(function() {
    coffer = cofferdam.connect(uri, key, db);
    coffer.should.be.ok;
  });


  describe('#connect()', function() {

    it('should create a new client', function() {
      var client = cofferdam.connect(uri, key, db);
      expect(client.client).to.be.ok;
      expect(client.host).to.be.eql(uri);
      expect(client.dbName).to.eql(db);
    });

  });

  describe('#findOrCreate(id)', function() {

    it('should create a database or retrieve it', function(done) {
      coffer.clients.database
        .findOrCreate(db)
        .then(function(database) {
          expect(database).to.be.ok;
          expect(DatabaseClient._database).to.be.eql(database);
          done();
        })
        .catch(done);
    });

  });

  describe('#remove(id)', function() {

    var _id = 'cofferdam-tests-temporary';
    beforeEach(function(done) {
      coffer.clients.database
        .findOrCreate(_id)
        .then(function(database) {
          expect(database).to.be.ok;
          done();
        })
        .catch(done);
    });

    it('should be able to remove a know database', function(done) {

      coffer.clients.database
        .remove(_id)
        .then(function() {
          return coffer.clients.database.findById(_id)
            .then(function(result) {
              expect(result).to.not.be.ok;
              done();
            });
        })
        .catch(done);
    });

  });

});
