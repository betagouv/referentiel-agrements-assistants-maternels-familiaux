import Hapi from '@hapi/hapi';

import { configuration } from '../configuration.js';

const createServer = async () => {
  const server = new Hapi.server({
    port: configuration.apiListeningPort,
  });

  server.route([
    {
      method: 'PUT',
      path: '/pajemploi/agrement',
      config: {
        auth: false,
        handler: async (request, hapi) => {
          if (request.payload.name === 'Jane') {
            return { nom: 'Jane', type: 'maternel' };
          }
          return hapi.response().code(404);
        },
      },
    },
  ]);

  return server;
};

export { createServer };
