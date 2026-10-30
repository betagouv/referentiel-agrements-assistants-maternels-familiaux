import { knex } from '../database/database-client.js';

const persister = async ({ nom, dateDeDelivrance }) => {
  const departementDeDelivrance = '59';
  await knex.table('agrement').insert({ nom, dateDeDelivrance, departementDeDelivrance });
};

const rechercher = async ({ nom }) => {
  const agrements = await knex.select('nom', 'dateDeDelivrance').table('agrement').where({ nom });
  return agrements;
};

export { persister, rechercher };
