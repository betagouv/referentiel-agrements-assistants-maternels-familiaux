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
    describe(`si le RNIPP met plus d'une seconde à répondre`, function () {
      it('doit lever une erreur', async function () {
        // given
        const oneSecond = 1000;
        nock(baseUrl).get('/identite?name=Elisabeth').delay(oneSecond).reply(200);
        const personne = { nom: 'Elisabeth' };

        // when
        let actual;
        try {
          await existe(personne);
        } catch (error) {
          actual = error;
        }

        // then
        const expected = new Error(`L'appel au RNIPP a pris plus de 500 ms.`);
        expect(actual.message).to.equal(expected.message);
      });
    });
    describe(`si le RNIPP renvoie une erreur 500`, function () {
      it('doit lever une erreur contenant le code retour', async function () {
        // given
        nock(baseUrl).get('/identite?name=Elisabeth').reply(500);
        const personne = { nom: 'Elisabeth' };

        // when
        let actual;
        try {
          await existe(personne);
        } catch (error) {
          actual = error;
        }

        // then
        const expected = new Error(`L'appel au RNIPP a échoué`, {
          cause: { message: `L'appel au RNIPP a renvoyé une erreur 500` },
        });
        expect(actual.message).to.deep.equal(expected.message);
        expect(actual.cause.message).to.deep.equal(expected.cause.message);
      });
    });
  });
});
