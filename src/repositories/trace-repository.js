import { knex } from '../database/database-client.js';

const persister = async () => {
  await knex.table('trace').insert({ utilisateur: '1', nom: 'John' });
};

export { persister };
