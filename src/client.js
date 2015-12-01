'use strict';

import DocumentDb from 'documentdb';

export default (uri, masterKey) => {
  return new DocumentDb.DocumentClient(uri, { masterKey: masterKey });
};
