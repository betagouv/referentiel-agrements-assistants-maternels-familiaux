import { knex } from '../../tooling/database-client/database-client.js';

const persister = async ({ utilisateur, nom, timestamp }) => {
  await knex.table('trace').insert({ utilisateur, nom, timestamp });
};

export { persister };
