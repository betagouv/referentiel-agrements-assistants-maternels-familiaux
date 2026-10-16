const up = async (knex) => {
  const query = `alter table agrement alter "dateDeDelivrance" TYPE TIMESTAMP WITH TIME ZONE`;
  await knex.raw(query);
};

const down = async (knex) => {
  const query = `alter table agrement alter "dateDeDelivrance" TYPE DATE`;
  await knex.raw(query);
};

export { down, up };
