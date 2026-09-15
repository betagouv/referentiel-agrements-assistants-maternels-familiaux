import Hapi from '@hapi/hapi';

import packageJSON from '../package.json' with { type: 'json' };
import { configuration } from './configuration.js';
import { status } from './healthcheck-repository.js';

const createServer = async () => {
  const server = new Hapi.server({
    port: configuration.apiListeningPort,
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
  ]);

  return server;
};

export { createServer };
