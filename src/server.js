import Hapi from '@hapi/hapi';

const createServer = async () => {
  const server = new Hapi.server({
    port: 3000,
  });

  server.route([
    {
      method: 'GET',
      path: '/api/healthcheck',
      config: {
        auth: false,
        handler: (request, h) => {
          return h.response().code(200);
        },
      },
    },
  ]);

  return server;
};

export { createServer };
