import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';

import { knex } from '../database/database-client.js';
import { createServer } from './server.js';

describe('PAJEMPLOI', function () {
  describe('PUT /agrement', function () {
    describe('if the person exists', function () {
      it('should return OK (200)', async function () {
        // given
        await knex.withSchema('pajemploi').table('agrement').truncate();
        await knex.withSchema('pajemploi').table('agrement').insert({ nom: 'Jane', type: 'maternel' });
        const server = await createServer();

        // when
        const nom = 'Jane';
        const query = { method: 'PUT', url: '/pajemploi/agrement', payload: { nom } };
        const { statusCode } = await server.inject(query);

        // then
        expect(statusCode).to.equal(StatusCodes.OK);
      });
      it('should return his history', async function () {
        // given
        await knex.withSchema('pajemploi').table('agrement').truncate();
        await knex.withSchema('pajemploi').table('agrement').insert({ nom: 'Jane', type: 'maternel' });
        const server = await createServer();

        // when
        const nom = 'Jane';
        const query = { method: 'PUT', url: '/pajemploi/agrement', payload: { nom } };
        const { payload } = await server.inject(query);
        const actual = JSON.parse(payload);

        // then
        expect(actual).to.deep.equal({ nom: 'Jane', type: 'maternel' });
      });
    });
    describe('if the person does not exist', function () {
      it('should return NOT FOUND (404)', async function () {
        // given
        await knex.withSchema('pajemploi').table('agrement').truncate();
        await knex.withSchema('pajemploi').table('agrement').insert({ nom: 'Jane', type: 'maternel' });
        const server = await createServer();

        // when
        const nom = 'Jack';
        const query = { method: 'PUT', url: '/pajemploi/agrement', payload: { nom } };
        const { statusCode } = await server.inject(query);

        // then
        expect(statusCode).to.equal(StatusCodes.NOT_FOUND);
      });
    });
  });
});
