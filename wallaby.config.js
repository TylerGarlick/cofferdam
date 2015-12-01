'use strict';

const babel = require('babel-core');
const config = require('./test/config');

module.exports = (wallaby) => {
  return {
    files: [
      'src/**/*',
      'test/**/*',
      { pattern: '**/*.tests.js', ignore: true }
    ],
    tests: [
      'test/**/*.tests.js'
    ],
    env: {
      type: 'node',
      params: {
        env: `DOCUMENT_DB_URI=${config.uri};DOCUMENT_DB_KEY=${config.key}`
      }
    },
    bootstrap: () => {
      require('babel-polyfill');
    },
    compilers: {
      '**/*.js': wallaby.compilers.babel({
        babel: babel,
        presets: ['es2015', "stage-0"],
        plugins: ['transform-decorators', 'babel-plugin-transform-runtime']
      })
    }
  }
};
