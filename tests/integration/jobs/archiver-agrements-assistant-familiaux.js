import { expect } from 'chai';

import { archiver } from '../../../src/jobs/archiver-agrement-familial.js';
import { knex as knexArchive } from '../../../tooling/archive-database-client.js';
import { knex as knexPrincipal } from '../../../tooling/database-client.js';

describe("Intégration | Jobs | Archiver les agréments d'assistant familial", function () {
  describe('#archiver', function () {
    describe("s'il y a un agrément", function () {
      it('alors il est archivé', async function () {
        // given
        await knexPrincipal.table('agrement').truncate();
        await knexArchive.table('agrement').truncate();
        const agrement = { nom: 'Dorothy', dateDeDelivrance: new Date('2003-01-01Z'), departementDeDelivrance: '59' };
        await knexPrincipal.table('agrement').insert(agrement);

        // when
        await archiver();
        const result = await knexArchive.select().from('agrement').where({ nom: 'Dorothy' });

        // then
        expect(result.length).to.equal(1);
        const actual = result[0];
        expect(actual).to.deep.equal({
          nom: 'Dorothy',
          departementDeDelivrance: '59',
          dateDeDelivrance: new Date('2003-01-01Z'),
        });
      });
    });
  });
});
