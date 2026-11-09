import { knex } from '../../tooling/database-client/database-client.js';

const persister = async ({ nom }) => {
  await knex.table('personne').insert({ nom });
};

export { persister };
