import Hapi from '@hapi/hapi';
import hapiInert from '@hapi/inert';
import hapiVision from '@hapi/vision';
import hapiPino from 'hapi-pino';
import hapiSwagger from 'hapi-swagger';

import { configuration } from './configuration.js';
import { routes } from './routes.js';

const createServer = async () => {
  const server = new Hapi.server({
    port: configuration.apiListeningPort,
  });

  server.route(routes);

  const swaggerPlugins = [
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
  ];

  const plugins = [...swaggerPlugins, { plugin: hapiPino }];
  await server.register(plugins);

  return server;
};

export { createServer };
