import { expect } from 'chai';

import { knex } from '../../../src/database/database-client.js';
import { persister, rechercher } from '../../../src/repositories/agrement-familial-repository.js';

describe('Integration | Repository | agrément', function () {
  describe('#persister', function () {
    describe("si l'agrément n'existe pas", function () {
      it('doit le persister', async function () {
        // given
        const agrement = { nom: 'Dorothy', dateDeDelivrance: new Date('2003-01-01Z') };
        await knex.table('agrement').truncate();

        // when
        await persister(agrement);
        const result = await knex.table('agrement').where({ nom: 'Dorothy' });

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
  describe('#rechercher', function () {
    describe("si l'agrément existe", function () {
      it('doit le renvoyer', async function () {
        // given
        await knex.table('agrement').truncate();
        const agrement = { nom: 'Dorothy', dateDeDelivrance: new Date('2003-01-01Z') };
        await knex.table('agrement').insert(agrement);

        // when
        const result = await rechercher({ nom: 'Dorothy' });

        // then
        expect(result.length).to.equal(1);
        expect(result[0]).to.deep.equal({ nom: 'Dorothy', dateDeDelivrance: new Date('2003-01-01Z') });
      });
    });
    describe("si l'agrément n'existe pas ", function () {
      it('doit renvoyer un tableau vide ', async function () {
        // given
        await knex.table('agrement').truncate();
        const agrement = { nom: 'Dorothy', dateDeDelivrance: new Date('2003-01-01Z') };
        await knex.table('agrement').insert(agrement);

        // when
        const result = await rechercher({ nom: 'Jack' });

        // then
        expect(result.length).to.equal(0);
      });
    });
  });
});
