const up = async (knex) => {
  await knex.schema.createTable('agrement', (table) => {
    table.string('nom');
    table.timestamp('dateDeDelivrance');
    table.text('departementDeDelivrance');
  });
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists('agrement');
};

export { down, up };
