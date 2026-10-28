import { expect } from 'chai';
import nock from 'nock';

import { configuration } from '../../../src/configuration.js';
import { rechercher } from '../../../src/repositories/agrement-maternel-repository.js';

describe("Integration | Repository | Agrément d'assistant maternel", function () {
  const baseUrl = configuration.dependencies.pajemploi.baseUrl;
  nock.disableNetConnect();
  describe('#rechercher', function () {
    describe("si la personne n'a aucun agrément", function () {
      it('doit renvoyer un tableau vide', async function () {
        // given
        nock(baseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/agrement', { nom: 'Dorothy' })
          .reply(200, { agrements: [] });

        // when
        const result = await rechercher({ nom: 'Dorothy' });

        // then
        expect(result).to.deep.equal([]);
      });
    });
    describe('si la personne a un agrément', function () {
      it('doit le renvoyer', async function () {
        // given
        const response = { agrements: [{ delivreLe: new Date('2026-10-02Z'), delivrePar: 59 }] };
        nock(baseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/agrement', { nom: 'Elisabeth' })
          .reply(200, response);

        // when
        const result = await rechercher({ nom: 'Elisabeth' });

        // then
        expect(result).to.deep.equal([{ dateDeDelivrance: new Date('2026-10-02Z'), departementDeDelivrance: 59 }]);
      });
    });
    describe('si la personne a plusieurs agréments', function () {
      it('doit les renvoyer', async function () {
        // given
        const response = {
          agrements: [
            { delivreLe: new Date('2026-10-02Z'), delivrePar: 59 },
            { delivreLe: new Date('2020-12-25Z'), delivrePar: 62 },
          ],
        };
        nock(baseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/agrement', { nom: 'Elisabeth' })
          .reply(200, response);

        // when
        const result = await rechercher({ nom: 'Elisabeth' });

        // then
        const expected = [
          { dateDeDelivrance: new Date('2026-10-02Z'), departementDeDelivrance: 59 },
          { dateDeDelivrance: new Date('2020-12-25Z'), departementDeDelivrance: 62 },
        ];
        expect(result).to.deep.equal(expected);
      });
    });
    describe(`si Pajemploi met plus du temps alloué à répondre (timeout)`, function () {
      it('doit lever une erreur mentionnant le temps alloué', async function () {
        // given
        const oneSecond = 1000;
        nock(baseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/agrement', { nom: 'Elisabeth' })
          .delay(oneSecond)
          .reply(200);

        // when
        let actual;
        try {
          await rechercher({ nom: 'Elisabeth' });
        } catch (error) {
          actual = error;
        }

        // then
        const expected = new Error(`L'appel à Pajemploi a pris plus de 500 ms.`);
        expect(actual).not.to.be.undefined;
        expect(actual.message).to.equal(expected.message);
      });
    });

    describe(`si Pajemploi renvoie une erreur 500`, function () {
      it('doit lever une erreur contenant le code retour', async function () {
        // given
        nock(baseUrl, {
          reqheaders: {
            'Content-Type': 'application/json',
          },
        })
          .put('/agrement', { nom: 'Elisabeth' })
          .reply(500);

        // when
        let actual;
        try {
          await rechercher({ nom: 'Elisabeth' });
        } catch (error) {
          actual = error;
        }

        // then
        const expected = new Error(`L'appel à Pajemploi a échoué`, {
          cause: { message: `Pajemploi a renvoyé une erreur 500` },
        });
        expect(actual.message).to.deep.equal(expected.message);
      });
    });
  });
});
