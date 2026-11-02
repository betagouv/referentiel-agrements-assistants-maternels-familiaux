const up = async (knex) => {
  await knex.schema.createTable('trace', (table) => {
    table.string('utilisateur');
    table.string('nom');
  });
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists('trace');
};

export { down, up };
