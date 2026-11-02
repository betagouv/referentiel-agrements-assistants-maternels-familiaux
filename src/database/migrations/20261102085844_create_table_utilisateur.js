const up = async (knex) => {
  await knex.schema.createTable('utilisateur', (table) => {
    table.string('identifiant');
    table.string('departement');
  });
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists('utilisateur');
};

export { down, up };
