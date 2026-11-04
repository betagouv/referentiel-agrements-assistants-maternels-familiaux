import { knex } from '../database/database-client.js';

const persister = async ({ utilisateur, nom, timestamp }) => {
  await knex.table('trace').insert({ utilisateur, nom, timestamp });
};

export { persister };
