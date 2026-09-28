import { knex } from '../database-client.js';

const seed = async () => {
  await knex.table('person').truncate();
  await knex.table('person').insert([{ name: 'Dorothy' }, { name: 'Elisabeth' }]);
};

export { seed };
