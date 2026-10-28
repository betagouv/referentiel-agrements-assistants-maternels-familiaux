const up = async (knex) => {
  await knex.schema.withSchema('pajemploi').table('agrement', (table) => {
    table.dropColumn('type');
  });
};

const down = async (knex) => {
  await knex.schema.withSchema('pajemploi').table('agrement', (table) => {
    table.string('type');
  });
};

export { down, up };
