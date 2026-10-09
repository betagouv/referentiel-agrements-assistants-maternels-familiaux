import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';

import { knex } from '../database/database-client.js';
import { createServer } from './server.js';

describe('RNIPP', function () {
  describe('PUT /person', function () {
    describe('if the person exists', function () {
      it('should return 200 (OK)', async function () {
        // given
        await knex.withSchema('rnipp').table('person').truncate();
        await knex.withSchema('rnipp').table('person').insert({ name: 'Jane' });
        const server = await createServer();

        // when
        const nom = 'Jane';
        const query = { method: 'PUT', url: '/rnipp/identite', payload: { nom } };
        const { statusCode } = await server.inject(query);

        // then
        expect(statusCode).to.equal(StatusCodes.OK);
      });
    });
    describe('if the person does not exist', function () {
      it('should return 404 (NOT FOUND)', async function () {
        // given
        await knex.withSchema('rnipp').table('person').truncate();
        await knex.withSchema('rnipp').table('person').insert({ name: 'Jane' });
        const server = await createServer();

        // when
        const nom = 'Mary';
        const query = { method: 'PUT', url: '/rnipp/identite', payload: { nom } };
        const response = await server.inject(query);

        // then
        expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND);
      });
    });
    describe('if the payload is not valid', function () {
      it('should return 400 (BAD REQUEST)', async function () {
        // given
        const server = await createServer();

        // when
        const query = { method: 'PUT', url: '/rnipp/identite', payload: { foo: 'bar' } };
        const response = await server.inject(query);

        // then
        expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
      });
    });
  });
});
