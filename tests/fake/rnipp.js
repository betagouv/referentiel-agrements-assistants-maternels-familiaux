import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';

import { knex } from './database-client.js';
import { createServer } from './server.js';

describe('RNIPP', function () {
  describe('PUT /person', function () {
    describe('if the person exists', function () {
      it('should return 200 (OK)', async function () {
        // given
        await knex('person').truncate();
        await knex('person').insert({ name: 'Jane' });
        const server = await createServer();

        // when
        const name = 'Jane';
        const query = { method: 'PUT', url: '/rnipp/person', payload: { name } };
        const { statusCode } = await server.inject(query);

        // then
        expect(statusCode).to.equal(StatusCodes.OK);
      });
    });
    describe('if the person does not exist', function () {
      it('should return 404 (NOT FOUND)', async function () {
        // given
        await knex('person').truncate();
        await knex('person').insert({ name: 'Jane' });
        const server = await createServer();

        // when
        const name = 'Mary';
        const query = { method: 'PUT', url: '/rnipp/person', payload: { name } };
        const response = await server.inject(query);

        // then
        expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND);
      });
    });
  });
});
