const up = async (knex) => {
  await knex.schema.table('agrement', (table) => {
    table.text('departementDeDelivrance');
  });
};

const down = async (knex) => {
  await knex.schema.table('agrement', (table) => {
    table.dropColumn('departementDeDelivrance');
  });
};
export { down, up };
