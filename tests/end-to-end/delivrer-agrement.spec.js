import { test } from '@playwright/test';
import { expect } from 'chai';

import { knex } from '../../src/database/database-client.js';

test.describe('End-to-end | Route | /api/agrement', () => {
  test.describe("quand l'utilisateur est authentifié et autorisé", () => {
    const utilisateur = { identifiant: '1', departement: '59' };
    const headers = { userId: utilisateur.identifiant };
    test.beforeAll(async () => {
      await knex.table('utilisateur').truncate();
      await knex.table('utilisateur').insert(utilisateur);
    });
    test.describe("quand l'identité de la personne est valide", () => {
      test("répond OK (200), persiste l'agrément et la personne", async ({ request }) => {
        // given
        await knex.table('agrement').truncate();
        await knex.table('personne').truncate();
        await knex.withSchema('rnipp').table('person').truncate();
        await knex.withSchema('rnipp').table('person').insert({ name: 'Jane' });

        // when
        const response = await request.put(`/api/agrement`, {
          headers,
          data: {
            personne: { nom: 'Jane' },
            agrement: { dateDelivrance: '2026-10-02Z' },
          },
        });

        // then
        expect(response.status()).to.equal(200);
        expect(response.statusText()).to.equal('OK');

        const personnes = await knex.select().from('personne').where({ nom: 'Jane' });
        expect(personnes.length).to.equal(1);

        const agrements = await knex.select().from('agrement').where({ nom: 'Jane' });
        expect(agrements.length).to.equal(1);
        expect(agrements[0]).to.deep.equal({
          nom: 'Jane',
          departementDeDelivrance: '59',
          dateDeDelivrance: new Date('2026-10-02Z'),
        });
      });
    });
  });
});
