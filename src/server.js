import Hapi from '@hapi/hapi';
import hapiInert from '@hapi/inert';
import hapiVision from '@hapi/vision';
import hapiSwagger from 'hapi-swagger';

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
        tags: ['api'],
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
        notes: ["Cette route permet d'obtenir la version de l'application et le statut des ressources."],
      },
    },
  ]);

  await server.register([
    hapiInert,
    hapiVision,
    {
      plugin: hapiSwagger,
      options: {
        info: {
          title: 'Référentiel national des agréments',
        },
      },
    },
  ]);

  return server;
};

export { createServer };
