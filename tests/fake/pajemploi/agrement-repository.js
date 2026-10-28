import { knex } from '../database/database-client.js';

const rechercher = async ({ nom }) => {
  const row = await knex
    .withSchema('pajemploi')
    .select('dateDeDelivrance', 'departementDeDelivrance')
    .table('agrement')
    .where({ nom });
  return row;
};

export { rechercher };
