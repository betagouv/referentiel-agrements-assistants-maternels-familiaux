import Hapi from '@hapi/hapi';
import hapiPino from 'hapi-pino';
import Joi from 'joi';

import { configuration } from '../configuration.js';
import { exists } from './person-repository.js';

const createServer = async () => {
  const server = new Hapi.server({
    port: configuration.rnipp.apiListeningPort,
  });

  const plugins = [{ plugin: hapiPino, options: { logPayload: true } }];
  await server.register(plugins);

  server.route([
    {
      method: 'PUT',
      path: '/rnipp/identite',
      config: {
        auth: false,
        tags: [],
        payload: { allow: 'application/json' },
        validate: {
          payload: Joi.object({
            nom: Joi.string().required(),
          }),
        },
        handler: async (request, h) => {
          const personExists = await exists({ name: request.payload.nom });
          if (personExists) {
            return h.response().code(200);
          }
          return h.response().code(404);
        },
        notes: ["Cette route permet de vérifier l'identité d'une personne"],
      },
    },
  ]);

  return server;
};

export { createServer };
