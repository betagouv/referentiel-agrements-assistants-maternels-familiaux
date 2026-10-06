import { expect } from 'chai';

import { knex } from '../../../src/database/database-client.js';
import { persister } from '../../../src/repositories/agrement-repository.js';

describe('Integration | Repository | agrément', function () {
  describe('#persister', function () {
    describe("si l'agrément n'existe pas", function () {
      it('doit le persister', async function () {
        // given
        const agrement = { nom: 'Dorothy', dateDeDelivrance: new Date('2003-01-01') };
        await knex.table('agrement').truncate();

        // when
        await persister(agrement);
        const result = await knex.table('agrement').where({ nom: 'Dorothy' });

        // then
        expect(result.length).to.equal(1);
        expect(result[0].nom).to.equal('Dorothy');
        expect(result[0].dateDeDelivrance.toDateString()).to.deep.equal(new Date('2003-01-01').toDateString());
      });
    });
  });
});
