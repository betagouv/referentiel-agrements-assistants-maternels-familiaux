import { expect } from 'chai';

import { existe } from '../../../src/repositories/identite-repository.js';

describe('Integration | Repository | Identité', function () {
  describe('#existe', function () {
    describe("si la personne n'existe pas", function () {
      it('doit renvoyer false', async function () {
        // given
        const personne = { nom: 'Dorothy' };

        // when
        const result = existe(personne);

        // then
        expect(result).to.be.false;
      });
    });
    describe('si la personne existe', function () {
      it('doit renvoyer true', async function () {
        // given
        const personne = { nom: 'Elisabeth' };

        // when
        const result = existe(personne);

        // then
        expect(result).to.be.true;
      });
    });
  });
});
