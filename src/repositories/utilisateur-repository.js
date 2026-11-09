import { knex } from '../../tooling/database-client/database-client.js';

const rechercher = async ({ identifiant }) => {
  const utilisateur = await knex.select('departement').from('utilisateur').where({ identifiant }).first();
  return utilisateur;
};

export { rechercher };
