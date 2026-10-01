const up = async (knex) => {
  await knex.schema.createSchemaIfNotExists('pajemploi');
  await knex.schema.withSchema('pajemploi').createTable('agrement', (table) => {
    table.string('nom');
    table.string('type');
  });
};

const down = async (knex) => {
  await knex.schema.withSchema('pajemploi').dropTableIfExists('agrement');
  await knex.schema.dropSchemaIfExists('pajemploi');
};

export { down, up };
