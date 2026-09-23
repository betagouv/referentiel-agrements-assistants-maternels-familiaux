import Hapi from '@hapi/hapi';
import hapiPino from 'hapi-pino';

import packageJSON from '../package.json' with { type: 'json' };
import { configuration } from './configuration.js';
import { status } from './healthcheck-repository.js';

const createServer = async () => {
  const server = new Hapi.server({
    port: configuration.apiListeningPort,
  });

  await server.register({
    plugin: hapiPino,
  });

  server.route([
    {
      method: 'GET',
      path: '/api',
      config: {
        auth: false,
        handler: async () => {
          return {
            name: packageJSON.name,
            version: packageJSON.version,
            resources: {
              database: {
                status: await status(),
              },
            },
          };
        },
      },
    },
    {
      method: 'GET',
      path: '/api/error',
      config: {
        auth: false,
        handler: async () => {
          throw new Error('An error was triggered', { cause: 'observability' });
        },
      },
    },
  ]);

  return server;
};

export { createServer };
