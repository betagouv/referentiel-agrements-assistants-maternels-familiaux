import { knex } from '../database/database-client.js';

const persister = async ({ utilisateur = '1', nom = 'John' }) => {
  await knex.table('trace').insert({ utilisateur, nom });
};

export { persister };
