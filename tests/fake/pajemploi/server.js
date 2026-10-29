import Hapi from '@hapi/hapi';
import Joi from 'joi';

import { configuration } from '../configuration.js';
import { rechercher } from './agrement-repository.js';

const createServer = async () => {
  const server = new Hapi.server({
    port: configuration.pajemploi.apiListeningPort,
  });

  server.route([
    {
      method: 'GET',
      path: '/pajemploi',
      config: {
        auth: false,
        handler: async (request, hapi) => {
          return hapi.response().code(200);
        },
      },
    },
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
          const agrements = await rechercher({ nom: request.payload.nom });
          const response = JSON.stringify({
            agrements: agrements.map((agrement) => ({
              delivreLe: agrement.dateDeDelivrance,
              delivrePar: agrement.departementDeDelivrance,
            })),
          });
          return hapi.response(response).code(200);
        },
      },
    },
  ]);

  return server;
};

export { createServer };
