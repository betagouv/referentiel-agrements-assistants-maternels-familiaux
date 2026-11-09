import { knex } from '../../../tooling/database-client.js';

const seed = async () => {
  await knex.table('utilisateur').truncate();
  await knex.table('utilisateur').insert([{ identifiant: '1', departement: '59' }]);
};

export { seed };
