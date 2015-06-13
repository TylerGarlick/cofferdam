'use strict';

global.expect = require('chai').expect;

global.uri = process.env.COFFERDAM_DOCUMENTDB_URI = process.env.COFFERDAM_DOCUMENTDB_URI || '';
global.key = process.env.COFFERDAM_DOCUMENTDB_KEY = process.env.COFFERDAM_DOCUMENTDB_KEY || '';
global.db = process.env.COFFERDAM_DOCUMENTDB_DB = process.env.COFFERDAM_DOCUMENTDB_DB || 'cofferdam_testing';
