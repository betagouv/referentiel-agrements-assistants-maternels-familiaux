import Hapi from '@hapi/hapi';

import packageJSON from '../package.json' with { type: 'json' };
import { configuration } from './configuration.js';

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
        handler: () => {
          return {
            name: packageJSON.name,
            version: packageJSON.version,
          };
        },
      },
    },
  ]);

  return server;
};

export { createServer };
