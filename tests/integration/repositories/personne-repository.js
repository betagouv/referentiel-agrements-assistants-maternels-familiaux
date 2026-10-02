import { expect } from 'chai';

import { knex } from '../../../src/database-client.js';
import { persister } from '../../../src/repositories/personne-repository.js';

describe('Integration | Repository | personne', function () {
  describe('#persister', function () {
    describe("si la personne n'existe pas", function () {
      it('doit la persister', async function () {
        // given
        const personne = { nom: 'Dorothy' };
        await knex.table('personne').truncate();

        // when
        await persister(personne);
        const result = await knex.table('personne').where({ nom: 'Dorothy' });

        // then
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({ nom: 'Dorothy' });
      });
    });
  });
});
