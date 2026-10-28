const up = async (knex) => {
  await knex.schema.withSchema('pajemploi').table('agrement', (table) => {
    table.timestamp('dateDeDelivrance');
  });
};

const down = async (knex) => {
  await knex.schema.withSchema('pajemploi').table('agrement', (table) => {
    table.timestamp('dateDeDelivrance');
  });
};

export { down, up };
