import { configuration as apiConfiguration } from './configuration.js';

const configuration = {
  client: 'pg',
  migrations: {
    directory: './migrations/',
  },
  connection: {
    connectionString: apiConfiguration.database.url,
  },
};

export default configuration;
