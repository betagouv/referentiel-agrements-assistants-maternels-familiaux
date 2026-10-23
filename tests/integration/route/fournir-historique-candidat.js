import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';

import { knex } from '../../../src/database/database-client.js';
import { createServer } from '../../../src/server.js';
describe(`Integration | Route | Historique du candidat`, function () {
  describe('PUT /api/historique-candidat', function () {
    describe("Si le candidat n'a aucun agrément", function () {
      it('doit retourner OK (200)', async function () {
        // given
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
  });
});
