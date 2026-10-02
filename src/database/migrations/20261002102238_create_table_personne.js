const up = async (knex) => {
  await knex.schema.createTable('personne', (table) => {
    table.string('nom');
  });
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists('personne');
};

export { down, up };
