import packageJSON from '../../package.json' with { type: 'json' };
import { status } from '../repositories/healthcheck-repository.js';

const healthcheck = {
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
};

const errorMonitoring = {
  method: 'GET',
  path: '/api/error',
  config: {
    auth: false,
    handler: async () => {
      throw new Error('An error was triggered', { cause: 'observability' });
    },
  },
};

export { errorMonitoring, healthcheck };
