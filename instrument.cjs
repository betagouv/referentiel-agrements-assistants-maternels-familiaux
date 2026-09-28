const Sentry = require('@sentry/node');

const dsn = process.env.SENTRY_DSN;
const application = process.env.SCALINGO_APPLICATION_ID;

const environmentIsScalingo = () => {
  return application !== undefined;
};

if (environmentIsScalingo()) {
  // https://docs.sentry.io/platforms/javascript/guides/hapi/configuration/options/#dataCollection
  Sentry.init({
    dsn,
    environment: application,
    release: 'beta',
    dataCollection: {
      userInfo: true,
      cookies: false,
      httpHeaders: { request: true, response: true },
      httpBodies: ['incomingRequest', 'outgoingRequest', 'incomingResponse', 'outgoingResponse'],
      urlQueryParams: true,
      graphQL: { document: false, variables: false },
      genAI: { inputs: false, outputs: false },
      databaseQueryData: false,
      queues: false,
      stackFrameVariables: true,
      frameContextLines: 5,
    },
  });
}
