import Hapi from '@hapi/hapi';

const createServer = async () => {
  const server = new Hapi.server({
    port: 3001,
  });

  server.route([
    {
      method: 'GET',
      path: '/rnipp/person',
      config: {
        auth: false,
        tags: [],
        handler: async () => {
          return {};
        },
        notes: ["Cette route permet de vérifier l'identité d'une personne"],
      },
    },
  ]);

  return server;
};

export { createServer };
