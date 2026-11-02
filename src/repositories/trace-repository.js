import { knex } from '../database/database-client.js';

const persister = async ({ utilisateur, nom }) => {
  await knex.table('trace').insert({ utilisateur, nom });
};

export { persister };
