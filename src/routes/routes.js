import { route as delivranceAgrement } from './delivrance-agrement.js';
import { route as historiqueCandidat } from './historique-candidat.js';
import { errorMonitoring, healthcheck } from './observability.js';

const routes = [healthcheck, errorMonitoring, delivranceAgrement, historiqueCandidat];

export { routes };
