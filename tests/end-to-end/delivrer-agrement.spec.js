import { test } from '@playwright/test';
import { expect } from 'chai';

import { knex } from '../../src/database/database-client.js';

test.describe('/api/agrement endpoint', () => {
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
          agrement: { dateDelivrance: '2026-10-02' },
        },
      });

      // then
      expect(response.status()).to.equal(200);
      expect(response.statusText()).to.equal('OK');

      const personnes = await knex('personne').where({ nom: 'Jane' });
      expect(personnes.length).to.equal(1);

      const agrements = await knex('agrement').where({ nom: 'Jane' });
      expect(agrements.length).to.equal(1);
      expect(agrements[0].dateDeDelivrance.toDateString()).to.equal(new Date('2026-10-02').toDateString());
    });
  });
});
