import { expect } from 'chai';
import nock from 'nock';

import { configuration } from '../../../src/configuration.js';
import { existe } from '../../../src/repositories/identite-repository.js';

describe('Integration | Repository | Identité', function () {
  const baseUrl = configuration.dependencies.rnipp.baseUrl;
  describe('#existe', function () {
    describe("si la personne n'existe pas", function () {
      it('doit renvoyer false', async function () {
        // given
        nock(baseUrl).get('/identite?name=Dorothy').reply(404);
        const personne = { nom: 'Dorothy' };

        // when
        const result = await existe(personne);

        // then
        expect(result).to.be.false;
      });
    });
    describe('si la personne existe', function () {
      it('doit renvoyer true', async function () {
        // given
        nock(baseUrl).get('/identite?name=Elisabeth').reply(200);
        const personne = { nom: 'Elisabeth' };

        // when
        const result = await existe(personne);

        // then
        expect(result).to.be.true;
      });
    });
  });
});
