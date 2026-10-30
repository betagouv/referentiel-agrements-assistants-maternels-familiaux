import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import nock from 'nock';

import { configuration } from '../../../src/configuration.js';
import { knex } from '../../../src/database/database-client.js';
import { createServer } from '../../../src/server.js';
describe(`Integration | Route | Historique du candidat`, function () {
  const pajemploiBaseUrl = configuration.dependencies.pajemploi.baseUrl;
  const rnippBaseUrl = configuration.dependencies.rnipp.baseUrl;
  describe('PUT /api/historique-candidat', function () {
    describe("Si l'identité du candidat n'est pas connue", function () {
      it('doit retourner BAD_REQUEST (400)', async function () {
        // given
        nock(rnippBaseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/identite', { nom: 'David' })
          .reply(StatusCodes.NOT_FOUND);

        await knex.table('agrement').truncate();
        await knex.table('personne').truncate();
        const payload = { nom: 'David' };
        const server = await createServer();
        const query = { method: 'PUT', url: '/api/historique-candidat', payload };

        // when
        const response = await server.inject(query);

        // then
        expect(response.statusCode).to.equal(StatusCodes.BAD_REQUEST);
      });
      it('doit retourner la raison en payload', async function () {
        // given
        nock(rnippBaseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/identite', { nom: 'David' })
          .reply(StatusCodes.NOT_FOUND);

        await knex.table('agrement').truncate();
        await knex.table('personne').truncate();
        const payload = { nom: 'David' };
        const server = await createServer();
        const query = { method: 'PUT', url: '/api/historique-candidat', payload };

        // when
        const response = await server.inject(query);

        // then
        const actual = response.payload;
        const expected = JSON.stringify({ cause: "L'identité du demandeur doit être connue dans le RNIPP" });
        expect(actual).to.deep.equal(expected);
      });
    });
    describe("Si le candidat n'a aucun agrément", function () {
      it('doit retourner OK (200)', async function () {
        // given
        nock(rnippBaseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/identite', { nom: 'Dorothy' })
          .reply(StatusCodes.OK);
        nock(pajemploiBaseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/agrement', { nom: 'Dorothy' })
          .reply(200, { agrements: [] });
        await knex.table('agrement').truncate();
        await knex.table('personne').truncate();
        const payload = { nom: 'Dorothy' };
        const server = await createServer();
        const query = { method: 'PUT', url: '/api/historique-candidat', payload };

        // when
        const response = await server.inject(query);

        // then
        expect(response.statusCode).to.equal(StatusCodes.OK);
      });
      it("doit retourner une liste d'agréments vide", async function () {
        // given
        nock(rnippBaseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/identite', { nom: 'Jack' })
          .reply(StatusCodes.OK);
        nock(pajemploiBaseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/agrement', { nom: 'Jack' })
          .reply(200, { agrements: [] });
        await knex.table('agrement').truncate();
        await knex.table('personne').truncate();
        const payload = { nom: 'Jack' };
        const server = await createServer();
        const query = { method: 'PUT', url: '/api/historique-candidat', payload };

        // when
        const response = await server.inject(query);

        // then
        const actual = JSON.parse(response.payload);
        expect(actual).to.deep.equal({
          agrements: [],
        });
      });
    });
    describe("Si le candidat a un agrément d'assistant familial", function () {
      it('doit retourner cet agrément', async function () {
        // given
        nock(rnippBaseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/identite', { nom: 'Dorothy' })
          .reply(StatusCodes.OK);
        nock(pajemploiBaseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/agrement', { nom: 'Dorothy' })
          .reply(200, { agrements: [] });
        await knex.table('agrement').truncate();
        await knex.table('personne').truncate();
        const agrement = { nom: 'Dorothy', dateDeDelivrance: new Date('2003-01-01T01:00:00.123+01:00') };
        await knex.table('agrement').insert(agrement);
        const payload = { nom: 'Dorothy' };
        const server = await createServer();
        const query = { method: 'PUT', url: '/api/historique-candidat', payload };

        // when
        const response = await server.inject(query);

        // then
        const actual = JSON.parse(response.payload);
        expect(actual).to.deep.equal({
          agrements: [{ type: 'familial', dateDeDelivrance: '2003-01-01T00:00:00.123Z' }],
        });
      });
    });
    describe("Si le candidat a un agrément d'assistant maternel", function () {
      it('doit retourner cet agrément', async function () {
        // given
        nock(rnippBaseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/identite', { nom: 'Elisabeth' })
          .reply(StatusCodes.OK);
        const nockedResponse = { agrements: [{ delivreLe: new Date('2003-01-01Z'), delivrePar: 59 }] };
        nock(pajemploiBaseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/agrement', { nom: 'Elisabeth' })
          .reply(200, nockedResponse);
        const payload = { nom: 'Elisabeth' };
        const server = await createServer();
        const query = { method: 'PUT', url: '/api/historique-candidat', payload };

        // when
        const response = await server.inject(query);

        // then
        const actual = JSON.parse(response.payload);
        expect(actual).to.deep.equal({
          agrements: [{ type: 'maternel', departementDeDelivrance: 59, dateDeDelivrance: '2003-01-01T00:00:00.000Z' }],
        });
      });
    });
  });
});
