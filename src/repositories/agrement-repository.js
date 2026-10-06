import { knex } from '../database/database-client.js';

const persister = async ({ nom, dateDeDelivrance }) => {
  await knex.table('agrement').insert({ nom, dateDeDelivrance });
};

export { persister };
