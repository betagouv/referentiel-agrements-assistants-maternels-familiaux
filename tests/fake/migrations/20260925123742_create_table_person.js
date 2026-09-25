const up = async (knex) => {
  await knex.schema.createTable('person', (table) => {
    table.string('name');
  });
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists('person');
};

export { down, up };
