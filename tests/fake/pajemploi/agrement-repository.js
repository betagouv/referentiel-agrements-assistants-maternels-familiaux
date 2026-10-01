import { knex } from '../database/database-client.js';

const get = async ({ nom }) => {
  const row = await knex.withSchema('pajemploi').select().table('agrement').where({ nom }).first();
  return row;
};

export { get };
