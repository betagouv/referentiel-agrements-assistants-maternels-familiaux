const up = async (knex) => {
  await knex.schema.table('trace', (table) => {
    table.timestamp('timestamp');
  });
};

const down = async (knex) => {
  await knex.schema.table('trace', (table) => {
    table.timestamp('timestamp');
  });
};
export { down, up };
