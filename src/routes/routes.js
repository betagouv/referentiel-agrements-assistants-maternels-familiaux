import { route as delivranceAgrement } from './delivrance-agrement.js';
import { errorMonitoring, healthcheck } from './observability.js';

const routes = [healthcheck, errorMonitoring, delivranceAgrement];

export { routes };
