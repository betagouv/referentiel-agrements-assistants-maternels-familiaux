import { expect } from 'chai';

import { persister } from '../../../src/repositories/trace-repository.js';
import { knex } from '../../../tooling/database-client.js';

describe('Intégration | Repository | Trace', function () {
  describe('#persister', function () {
    it('doit persister la trace', async function () {
      // given
      await knex.table('trace').truncate();
      const trace = { utilisateur: '1', nom: 'Jack', timestamp: new Date('2017-12-31T23:59:59-01:00') };

      // when
      await persister(trace);
      const result = await knex.select().from('trace');

      // then
      expect(result.length).to.equal(1);
      expect(result[0]).to.deep.equal({
        utilisateur: '1',
        nom: 'Jack',
        timestamp: new Date('2017-12-31T23:59:59-01:00'),
      });
    });
  });
});
