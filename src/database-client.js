import Knex from 'knex';

import { configuration } from './configuration.js';

const knex = Knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: configuration.databaseUserPassword,
  },
});

export { knex };
