const up = async (knex) => {
  await knex.schema.createTable('agrement', (table) => {
    table.string('nom');
    table.date('dateDeDelivrance');
  });
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists('agrement');
};

export { down, up };
