import { expect } from 'chai';

import { knex } from '../../../src/database/database-client.js';
import { rechercher } from '../../../src/repositories/utilisateur-repository.js';

describe('Integration | Repository | Utilisateur', function () {
  describe('#rechercher', function () {
    describe('si la personne existe', function () {
      it('doit renvoyer le département', async function () {
        // given
        await knex.table('utilisateur').truncate();
        await knex.table('utilisateur').insert({ identifiant: '1', departement: '59' });
        const utilisateur = { identifiant: '1' };

        // when
        const result = await rechercher(utilisateur);

        // then
        expect(result).to.deep.equal({ departement: '59' });
      });
    });
    describe("si la personne n'existe pas", function () {
      it('doit renvoyer undefined', async function () {
        // given
        await knex.table('utilisateur').truncate();
        await knex.table('utilisateur').insert({ identifiant: '1', departement: '59' });
        const utilisateur = { identifiant: '2' };

        // when
        const result = await rechercher(utilisateur);

        // then
        expect(result).to.be.undefined;
      });
    });
  });
});
