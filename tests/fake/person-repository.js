import { knex } from './database-client.js';

const exists = async ({ name }) => {
  const rows = await knex.select().table('person').where({ name });
  if (rows.length > 0) {
    return true;
  }
  return false;
};

export { exists };
