import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';

import { knex } from '../database/database-client.js';
import { createServer } from './server.js';

describe('Integration | Fake | Pajemploi', function () {
  describe('PUT /agrement', function () {
    describe('si la personne a deux agréments', function () {
      it('doit retourner OK (200)', async function () {
        // given
        await knex.withSchema('pajemploi').table('agrement').truncate();
        await knex
          .withSchema('pajemploi')
          .table('agrement')
          .insert({ nom: 'Jane', dateDeDelivrance: new Date('2003-01-01Z'), departementDeDelivrance: '59' });
        const server = await createServer();

        // when
        const nom = 'Jane';
        const query = { method: 'PUT', url: '/pajemploi/agrement', payload: { nom } };
        const { statusCode } = await server.inject(query);

        // then
        expect(statusCode).to.equal(StatusCodes.OK);
      });
      it('doit returner les agréments', async function () {
        // given
        await knex.withSchema('pajemploi').table('agrement').truncate();
        await knex
          .withSchema('pajemploi')
          .table('agrement')
          .insert({ nom: 'Jane', dateDeDelivrance: new Date('2003-01-01Z'), departementDeDelivrance: '59' });
        await knex
          .withSchema('pajemploi')
          .table('agrement')
          .insert({ nom: 'Jane', dateDeDelivrance: new Date('2023-01-01Z'), departementDeDelivrance: '62' });
        const server = await createServer();

        // when
        const nom = 'Jane';
        const query = { method: 'PUT', url: '/pajemploi/agrement', payload: { nom } };
        const { payload } = await server.inject(query);
        const actual = JSON.parse(payload);

        // then
        expect(actual).to.deep.equal({
          agrements: [
            { delivreLe: '2003-01-01T00:00:00.000Z', delivrePar: '59' },
            { delivreLe: '2023-01-01T00:00:00.000Z', delivrePar: '62' },
          ],
        });
      });
    });
    describe("si la personne n'a pas d'agrément", function () {
      it('doit retourner OK (200)', async function () {
        // given
        await knex.withSchema('pajemploi').table('agrement').truncate();
        await knex
          .withSchema('pajemploi')
          .table('agrement')
          .insert({ nom: 'Jane', dateDeDelivrance: new Date('2003-01-01Z'), departementDeDelivrance: '59' });
        const server = await createServer();

        // when
        const nom = 'Jack';
        const query = { method: 'PUT', url: '/pajemploi/agrement', payload: { nom } };
        const { statusCode } = await server.inject(query);

        // then
        expect(statusCode).to.equal(StatusCodes.OK);
      });
      it('doit retourner un tableau vide', async function () {
        // given
        await knex.withSchema('pajemploi').table('agrement').truncate();
        await knex
          .withSchema('pajemploi')
          .table('agrement')
          .insert({ nom: 'Jane', dateDeDelivrance: new Date('2003-01-01Z'), departementDeDelivrance: '59' });
        const server = await createServer();

        // when
        const nom = 'Jack';
        const query = { method: 'PUT', url: '/pajemploi/agrement', payload: { nom } };
        const { payload } = await server.inject(query);
        const actual = JSON.parse(payload);

        // then
        expect(actual).to.deep.equal({ agrements: [] });
      });
    });
  });
});
