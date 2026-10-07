import { knex } from '../database-client.js';

const seed = async () => {
  await knex.table('personne').truncate();
  await knex.table('personne').insert([{ nom: 'Dorothy' }, { nom: 'Elisabeth' }]);
};

export { seed };
