import Hapi from '@hapi/hapi';
import Joi from 'joi';

import { configuration } from '../configuration.js';
import { get } from './agrement-repository.js';

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
        tags: [],
        payload: { allow: 'application/json' },
        validate: {
          payload: Joi.object({
            nom: Joi.string().required(),
          }),
        },
        handler: async (request, hapi) => {
          const agrement = await get({ nom: request.payload.nom });
          if (agrement) {
            return agrement;
          }
          return hapi.response().code(404);
        },
      },
    },
  ]);

  return server;
};

export { createServer };
