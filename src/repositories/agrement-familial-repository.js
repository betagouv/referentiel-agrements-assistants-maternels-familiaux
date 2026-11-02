import { knex } from '../database/database-client.js';

const persister = async ({ nom, dateDeDelivrance, departementDeDelivrance }) => {
  await knex.table('agrement').insert({ nom, dateDeDelivrance, departementDeDelivrance });
};

const rechercher = async ({ nom }) => {
  const agrements = await knex
    .select('nom', 'dateDeDelivrance', 'departementDeDelivrance')
    .from('agrement')
    .where({ nom });
  return agrements;
};

export { persister, rechercher };
