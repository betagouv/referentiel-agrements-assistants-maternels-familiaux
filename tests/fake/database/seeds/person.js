import { knex } from '../database-client.js';

const seed = async () => {
  await knex.withSchema('rnipp').table('person').truncate();
  await knex
    .withSchema('rnipp')
    .table('person')
    .insert([{ name: 'Dorothy' }, { name: 'Elisabeth' }]);
};

export { seed };
