import { test } from '@playwright/test';
import { expect, use } from 'chai';
import chaiExclude from 'chai-exclude';
use(chaiExclude);
import { StatusCodes } from 'http-status-codes';

import { knex } from '../../tooling/database-client/database-client.js';

test.describe('End-to-end | Route | /api/historique-candidat', () => {
  test.describe.configure({ retries: 3 });

  test.describe("quand l'utilisateur est authentifié", () => {
    const utilisateur = { identifiant: '1', departement: '59' };
    const headers = { userId: utilisateur.identifiant };
    test.describe("quand l'identité du candidat est valide", () => {
      test.describe("et qu'il a un agrément d'assistant familial et maternel", () => {
        test("répond OK (200), renvoie ces deux agréments et trace l'accès", async ({ request }) => {
          // given
          await knex.table('agrement').truncate();
          const agrement = { nom: 'Dorothy', dateDeDelivrance: new Date('2025-01-01Z'), departementDeDelivrance: '59' };
          await knex.table('agrement').insert(agrement);

          await knex.withSchema('rnipp').table('person').truncate();
          await knex.withSchema('rnipp').table('person').insert({ name: 'Dorothy' });

          await knex.withSchema('pajemploi').table('agrement').truncate();
          await knex
            .withSchema('pajemploi')
            .table('agrement')
            .insert({ nom: 'Dorothy', dateDeDelivrance: new Date('2026-01-01Z'), departementDeDelivrance: '59' });

          await knex.table('trace').truncate();

          // when
          const response = await request.put(`/api/historique-candidat`, {
            headers,
            data: {
              nom: 'Dorothy',
            },
          });

          // then
          expect(response.status()).to.equal(StatusCodes.OK);
          expect(response.statusText()).to.equal('OK');
          const payload = await response.json();

          expect(payload.agrements).to.have.deep.members([
            { type: 'familial', dateDeDelivrance: '2025-01-01T00:00:00.000Z', departementDeDelivrance: '59' },
            { type: 'maternel', dateDeDelivrance: '2026-01-01T00:00:00.000Z', departementDeDelivrance: '59' },
          ]);

          // then
          const traces = await knex.select().from('trace');
          expect(traces.length).to.equal(1);
          expect(traces[0]).excluding('timestamp').to.deep.equal({ utilisateur: '1', nom: 'Dorothy' });
        });
      });
    });
  });
});
