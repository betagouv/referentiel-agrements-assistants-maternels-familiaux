const up = async (knex) => {
  await knex.schema.createSchemaIfNotExists('rnipp');
  await knex.schema.withSchema('rnipp').createTable('person', (table) => {
    table.string('name');
  });
};

const down = async (knex) => {
  await knex.schema.withSchema('rnipp').dropTableIfExists('person');
  await knex.schema.dropSchemaIfExists('rnipp');
};

export { down, up };
