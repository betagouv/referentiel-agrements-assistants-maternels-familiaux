import { knex as knexArchive } from '../../tooling/archive-database-client.js';
import { knex as knexPrincipal } from '../../tooling/database-client.js';

const archiver = async () => {
  const agrements = await knexPrincipal.select().from('agrement');
  await knexArchive.table('agrement').insert(agrements);
};

export { archiver };
