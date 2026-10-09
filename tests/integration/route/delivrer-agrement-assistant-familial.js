import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import nock from 'nock';

import { configuration } from '../../../src/configuration.js';
import { knex } from '../../../src/database/database-client.js';
import { createServer } from '../../../src/server.js';
describe(`Integration | Route | Délivrance d'agrément`, function () {
  const baseUrl = configuration.dependencies.rnipp.baseUrl;
  describe('PUT /api/agrement', function () {
    describe("Si ni la personne, ni l'agrément n'existent", function () {
      describe("Si l'identité de la personne est valide", function () {
        it('doit retourner OK (200)', async function () {
          // given
          nock(baseUrl).get('/identite?name=Dorothy').reply(200);
          const payload = { personne: { nom: 'Dorothy' }, agrement: { dateDelivrance: '2003-01-01' } };
          const server = await createServer();
          const query = { method: 'PUT', url: '/api/agrement', payload };

          // when
          const response = await server.inject(query);

          // then
          expect(response.statusCode).to.equal(StatusCodes.OK);
        });
        it('doit persister la personne', async function () {
          // given
          nock(baseUrl).get('/identite?name=Dorothy').reply(200);
          await knex.table('agrement').truncate();
          await knex.table('personne').truncate();
          const payload = { personne: { nom: 'Dorothy' }, agrement: { dateDelivrance: '2003-01-01' } };
          const server = await createServer();
          const query = { method: 'PUT', url: '/api/agrement', payload };

          // when
          await server.inject(query);
          const actual = await knex('personne').where({ nom: 'Dorothy' });

          // then
          expect(actual.length).to.equal(1);
        });
        it("doit persister l'agrément", async function () {
          // given
          nock(baseUrl).get('/identite?name=Dorothy').reply(200);
          await knex.table('agrement').truncate();
          await knex.table('personne').truncate();
          const payload = { personne: { nom: 'Dorothy' }, agrement: { dateDelivrance: '2003-01-01' } };
          const server = await createServer();
          const query = { method: 'PUT', url: '/api/agrement', payload };

          // when
          await server.inject(query);
          const actual = await knex('agrement').where({ nom: 'Dorothy' });

          // then
          expect(actual.length).to.equal(1);
          expect(actual[0].dateDeDelivrance.toDateString()).to.equal(new Date('2003-01-01').toDateString());
        });
      });
      describe("Si l'identité de la personne n'est pas valide", function () {
        it('doit retourner BAD_REQUEST (400)', async function () {
          // given
          nock(baseUrl).get('/identite?name=Dorothy').reply(404);
          const payload = { personne: { nom: 'Dorothy' }, agrement: { dateDelivrance: '2003-01-01' } };
          const server = await createServer();
          const query = { method: 'PUT', url: '/api/agrement', payload };

          // when
          const response = await server.inject(query);

          // then
          expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
        });
        it('ne doit pas persister la personne', async function () {
          // given
          nock(baseUrl).get('/identite?name=Dorothy').reply(404);
          await knex.table('agrement').truncate();
          await knex.table('personne').truncate();
          const payload = { personne: { nom: 'Dorothy' }, agrement: { dateDelivrance: '2003-01-01' } };
          const server = await createServer();
          const query = { method: 'PUT', url: '/api/agrement', payload };

          // when
          await server.inject(query);
          const actual = await knex('personne').where({ nom: 'Dorothy' });

          // then
          expect(actual.length).to.equal(0);
        });
        it("ne doit pas persister l'agrément", async function () {
          // given
          nock(baseUrl).get('/identite?name=Dorothy').reply(404);
          await knex.table('agrement').truncate();
          await knex.table('personne').truncate();
          const payload = { personne: { nom: 'Dorothy' }, agrement: { dateDelivrance: '2003-01-01' } };
          const server = await createServer();
          const query = { method: 'PUT', url: '/api/agrement', payload };

          // when
          await server.inject(query);
          const actual = await knex('agrement').where({ nom: 'Dorothy' });

          // then
          expect(actual.length).to.equal(0);
        });
      });
    });
  });
});
