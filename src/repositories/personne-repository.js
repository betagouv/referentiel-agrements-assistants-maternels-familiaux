import { knex } from '../database/database-client.js';

const persister = async ({ nom }) => {
  await knex.table('personne').insert({ nom });
};

export { persister };
