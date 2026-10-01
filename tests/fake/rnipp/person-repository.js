import { knex } from '../database/database-client.js';

const exists = async ({ name }) => {
  const rows = await knex.withSchema('rnipp').select().table('person').where({ name });
  if (rows.length > 0) {
    return true;
  }
  return false;
};

export { exists };
