import { test } from '@playwright/test';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';

import { knex } from '../../src/database/database-client.js';

test.describe('End-to-end | Route | /api/historique-candidat', () => {
  test.describe.configure({ retries: 3 });
  test.describe("quand le candidat a un agrément d'assistant familial et maternel", () => {
    test('répond OK (200) et renvoie ces deux agréments', async ({ request }) => {
      // given
      await knex.table('agrement').truncate();
      const agrement = { nom: 'Dorothy', dateDeDelivrance: new Date('2025-01-01Z') };
      await knex.table('agrement').insert(agrement);

      await knex.withSchema('pajemploi').table('agrement').truncate();
      await knex
        .withSchema('pajemploi')
        .table('agrement')
        .insert({ nom: 'Dorothy', dateDeDelivrance: new Date('2026-01-01Z'), departementDeDelivrance: '59' });

      // when
      const response = await request.put(`/api/historique-candidat`, {
        data: {
          nom: 'Dorothy',
        },
      });

      // then
      expect(response.status()).to.equal(StatusCodes.OK);
      expect(response.statusText()).to.equal('OK');
      const payload = await response.json();

      expect(payload.agrements).to.have.deep.members([
        { type: 'familial', dateDeDelivrance: '2025-01-01T00:00:00.000Z' },
        { type: 'maternel', dateDeDelivrance: '2026-01-01T00:00:00.000Z', departementDeDelivrance: '59' },
      ]);
    });
  });
});
