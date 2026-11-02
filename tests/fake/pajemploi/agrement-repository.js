import { knex } from '../database/database-client.js';

const rechercher = async ({ nom }) => {
  const row = await knex
    .withSchema('pajemploi')
    .select('dateDeDelivrance', 'departementDeDelivrance')
    .from('agrement')
    .where({ nom });
  return row;
};

export { rechercher };
