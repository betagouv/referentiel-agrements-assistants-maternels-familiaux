import { test } from '@playwright/test';
import { expect } from 'chai';

import { knex } from '../../src/database/database-client.js';

test.describe('End-to-end | Route | /api/agrement', () => {
  test.describe("quand l'identité de la personne est valide", () => {
    test("répond OK (200), persiste l'agrément et la personne", async ({ request }) => {
      // given
      await knex.table('agrement').truncate();
      await knex.table('personne').truncate();
      await knex.withSchema('rnipp').table('person').truncate();
      await knex.withSchema('rnipp').table('person').insert({ name: 'Jane' });

      // when
      const response = await request.put(`/api/agrement`, {
        data: {
          personne: { nom: 'Jane' },
          agrement: { dateDelivrance: '2026-10-02Z' },
        },
      });

      // then
      expect(response.status()).to.equal(200);
      expect(response.statusText()).to.equal('OK');

      const personnes = await knex('personne').where({ nom: 'Jane' });
      expect(personnes.length).to.equal(1);

      const agrements = await knex('agrement').where({ nom: 'Jane' });
      expect(agrements.length).to.equal(1);
      expect(agrements[0]).to.deep.equal({ nom: 'Jane', dateDeDelivrance: new Date('2026-10-02Z') });
    });
  });
});
