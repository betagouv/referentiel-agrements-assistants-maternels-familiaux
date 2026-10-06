import Hapi from '@hapi/hapi';
import hapiInert from '@hapi/inert';
import hapiVision from '@hapi/vision';
import hapiPino from 'hapi-pino';
import hapiSwagger from 'hapi-swagger';
import Joi from 'joi';

import packageJSON from '../package.json' with { type: 'json' };
import { configuration } from './configuration.js';
import * as agrementRepository from './repositories/agrement-repository.js';
import { status } from './repositories/healthcheck-repository.js';
import * as personneRepository from './repositories/personne-repository.js';

const createServer = async () => {
  const server = new Hapi.server({
    port: configuration.apiListeningPort,
  });

  const routes = [
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
    {
      method: 'PUT',
      path: '/api/agrement',
      config: {
        auth: false,
        tags: ['api'],
        payload: { allow: 'application/json' },
        validate: {
          payload: Joi.object({
            personne: {
              nom: Joi.string().required(),
            },
            agrement: {
              dateDelivrance: Joi.string().required(),
            },
          }),
        },
        handler: async (request, hapi) => {
          const nom = request.payload.personne.nom;
          const dateDeDelivrance = request.payload.agrement.dateDelivrance;
          await personneRepository.persister({ nom });
          await agrementRepository.persister({
            nom,
            dateDeDelivrance,
          });
          return hapi.response().code(200);
        },
        notes: ["Cette route permet de délivrer un agrément d'assistant familial."],
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
  ];
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
