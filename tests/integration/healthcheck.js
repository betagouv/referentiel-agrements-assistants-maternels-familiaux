import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';

import { createServer } from '../../src/server.js';

describe('Integration | Route | healthcheck', function () {
  describe('GET /healthcheck', function () {
    describe('when the server if properly configured', function () {
      it('should return OK (200)', async function () {
        // given
        const server = await createServer();
        const query = { method: 'GET', url: '/api/healthcheck' };

        // when
        const response = await server.inject(query);

        // then
        expect(response.statusCode).to.equal(StatusCodes.OK);
      });
    });
  });
});
