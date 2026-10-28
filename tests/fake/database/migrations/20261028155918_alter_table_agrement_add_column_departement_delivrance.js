const up = async (knex) => {
  await knex.schema.withSchema('pajemploi').table('agrement', (table) => {
    table.text('departementDeDelivrance');
  });
};

const down = async (knex) => {
  await knex.schema.withSchema('pajemploi').table('agrement', (table) => {
    table.text('departementDeDelivrance');
  });
};

export { down, up };
