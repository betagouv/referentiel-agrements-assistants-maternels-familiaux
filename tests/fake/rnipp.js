import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';

import { createServer } from './server.js';

describe('RNIPP', function () {
  describe('PUT /person', function () {
    describe('if the person exists', function () {
      it('should return 200 (OK)', async function () {
        const server = await createServer();
        const query = { method: 'PUT', url: '/rnipp/person', payload: { name: 'Jane' } };

        // when
        const { statusCode } = await server.inject(query);

        // then
        expect(statusCode).to.equal(StatusCodes.OK);
      });
    });
    describe('if the person does not exist', function () {
      it('should return 404 (NOT FOUND)', async function () {
        const server = await createServer();
        const query = { method: 'PUT', url: '/rnipp/person', payload: { name: 'Mary' } };

        // when
        const response = await server.inject(query);

        // then
        expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND);
      });
    });
  });
});
