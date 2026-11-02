import { expect } from 'chai';

import { knex } from '../../../src/database/database-client.js';
import { persister } from '../../../src/repositories/trace-repository.js';

describe('Intégration | Repository | Trace', function () {
  describe('#persister', function () {
    it('doit persister la trace', async function () {
      // given
      await knex.table('trace').truncate();
      const trace = { utilisateur: '1', nom: 'Jack' };

      // when
      await persister(trace);
      const result = await knex.select().from('trace');

      // then
      expect(result.length).to.equal(1);
      expect(result[0]).to.deep.equal({ utilisateur: '1', nom: 'Jack' });
    });
  });
});
