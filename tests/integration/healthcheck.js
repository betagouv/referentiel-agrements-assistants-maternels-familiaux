import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';

import { createServer } from '../../src/server.js';

describe('Integration | Route | api', function () {
  describe('GET /api', function () {
    describe('if the server if properly configured', function () {
      it('should return OK (200)', async function () {
        // given
        const server = await createServer();
        const query = { method: 'GET', url: '/api' };

        // when
        const response = await server.inject(query);

        // then
        expect(response.statusCode).to.equal(StatusCodes.OK);
      });
      it('should return the application name and version', async function () {
        // given
        const server = await createServer();
        const query = { method: 'GET', url: '/api' };

        // when
        const response = await server.inject(query);

        // then
        const actual = JSON.parse(response.payload);
        expect(actual).to.include({
          name: 'referentiel-national-agrements',
          version: '0.0.0',
        });
      });
    });
    describe('if the database can be reached', function () {
      it('should return its status as up', async function () {
        // given
        const server = await createServer();
        const query = { method: 'GET', url: '/api' };

        // when
        const response = await server.inject(query);

        // then
        const actual = JSON.parse(response.payload);
        expect(actual).to.include({
          resources: {
            database: 'up',
          },
        });
      });
    });
  });
});
