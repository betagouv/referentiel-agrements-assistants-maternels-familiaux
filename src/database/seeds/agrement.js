import { knex } from '../database-client.js';

const seed = async () => {
  await knex.table('agrement').truncate();
  await knex.table('agrement').insert([
    { nom: 'Dorothy', dateDeDelivrance: new Date('2003-01-01Z') },
    { nom: 'Elisabeth', dateDeDelivrance: new Date('2027-03-28Z') },
  ]);
};

export { seed };
