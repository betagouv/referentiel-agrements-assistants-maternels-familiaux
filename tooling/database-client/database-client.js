import Knex from 'knex';

import { configuration } from '../../src/configuration.js';

const knex = Knex({
  client: 'pg',
  connection: {
    connectionString: configuration.database.url,
  },
});

export { knex };
