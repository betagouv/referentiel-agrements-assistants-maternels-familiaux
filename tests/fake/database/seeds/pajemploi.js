import { knex } from '../database-client.js';

const seed = async () => {
  await knex.withSchema('pajemploi').table('agrement').truncate();
  await knex
    .withSchema('pajemploi')
    .table('agrement')
    .insert([
      { nom: 'Dorothy', type: 'maternel' },
      { nom: 'Elisabeth', type: 'maternel' },
    ]);
};

export { seed };
