import { knex } from '../database-client.js';

const seed = async () => {
  await knex.withSchema('pajemploi').table('agrement').truncate();
  await knex
    .withSchema('pajemploi')
    .table('agrement')
    .insert([
      { nom: 'Dorothy', dateDeDelivrance: new Date('2003-01-01Z'), departementDeDelivrance: '59' },
      { nom: 'Dorothy', dateDeDelivrance: new Date('2026-01-01Z'), departementDeDelivrance: '62' },
      { nom: 'Elisabeth', dateDeDelivrance: new Date('2003-01-01Z'), departementDeDelivrance: '62' },
    ]);
};

export { seed };
