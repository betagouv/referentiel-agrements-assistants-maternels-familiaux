import Hapi from '@hapi/hapi';
import Joi from 'joi';

import { configuration } from './configuration.js';
import { exists } from './person-repository.js';

const createServer = async () => {
  const server = new Hapi.server({
    port: configuration.apiListeningPort,
  });

  server.route([
    {
      method: 'PUT',
      path: '/rnipp/person',
      config: {
        auth: false,
        tags: [],
        payload: { allow: 'application/json' },
        validate: {
          payload: Joi.object({
            name: Joi.string().required(),
          }),
        },
        handler: async (request, h) => {
          const personExists = await exists({ name: request.payload.name });
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
