import { knex } from '../../tooling/database-client.js';

const status = async () => {
  try {
    await knex.raw('SELECT version();');
    return 'up';
  } catch {
    return 'down';
  }
};

export { status };
