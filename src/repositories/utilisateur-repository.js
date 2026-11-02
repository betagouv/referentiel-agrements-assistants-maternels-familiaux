import { knex } from '../database/database-client.js';

const rechercher = async ({ identifiant }) => {
  const utilisateur = await knex.select('departement').from('utilisateur').where({ identifiant }).first();
  return utilisateur;
};

export { rechercher };
