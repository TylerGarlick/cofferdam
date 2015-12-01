'use strict';

import {expect} from 'code';
import Database from '../src/database';
import Nock from 'nock';


const uri = process.env.DOCUMENT_DB_URI;
const key = process.env.DOCUMENT_DB_KEY;

Nock.disableNetConnect();

let documentDb = Nock(uri);
documentDb.get('/dbs').reply(200, {
  "_rid": "",
  "Databases": [
    {
      "id": "ProductDB",
      "_rid": "0EwFAA==",
      "_ts": 1408176196,
      "_self": "dbs\/0EwFAA==\/",
      "_etag": "00001c00-0000-0000-0000-53ef10440000",
      "_colls": "colls\/",
      "_users": "users\/"
    },
    {
      "id": "CampaignDB",
      "_rid": "1g4RAA==",
      "_ts": 1408170887,
      "_self": "dbs\/1g4RAA==\/",
      "_etag": "00000c00-0000-0000-0000-53eefb870000",
      "_colls": "colls\/",
      "_users": "users\/"
    },
    {
      "id": "LeadsDB",
      "_rid": "TGUbAA==",
      "_ts": 1408173449,
      "_self": "dbs\/TGUbAA==\/",
      "_etag": "00001900-0000-0000-0000-53ef05890000",
      "_colls": "colls\/",
      "_users": "users\/"
    }
  ],
  "_count": 3
});

describe('Database', () => {

  describe('all()', () => {

    let database;
    beforeEach(() => {
      database = new Database(uri, key);
      expect(database.all).to.be.a.function();
    });

    it('can retrieve all the databases', (done) => {
      database.all()
        .then(results => {
          expect(results).to.not.be.empty();
          done();
        })
        .catch(done);
    });

  });

});
