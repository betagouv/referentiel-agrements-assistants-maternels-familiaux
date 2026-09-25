import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';

import { createServer } from './server.js';

describe('RNIPP', function () {
  describe('if the person exists', function () {
    it('should return 200 (OK)', async function () {
      const server = await createServer();
      const query = { method: 'GET', url: '/rnipp/person' };

      // when
      const { statusCode } = await server.inject(query);

      // then
      expect(statusCode).to.equal(StatusCodes.OK);
    });
  });
});
