import { configuration } from '../configuration.js';
const timeoutMilliseconds = configuration.dependencies.pajemploi.timeout;

const baseUrl = configuration.dependencies.pajemploi.baseUrl;

const rechercher = async ({ nom }) => {
  const method = 'PUT';
  const route = 'agrement';
  const url = `${baseUrl}/${route}`;
  const body = JSON.stringify({ nom });
  const headers = {
    'Content-Type': 'application/json',
  };

  let response;
  try {
    // eslint-disable-next-line no-undef
    response = await fetch(url, {
      method,
      headers,
      body,
      // eslint-disable-next-line no-undef
      signal: AbortSignal.timeout(timeoutMilliseconds),
    });
  } catch (error) {
    if (error.name === 'TimeoutError') {
      // eslint-disable-next-line preserve-caught-error
      throw new Error(`L'appel à Pajemploi a pris plus de ${timeoutMilliseconds} ms.`);
    }
  }
  if (response.ok) {
    const data = await response.json();
    return data.agrements.map((agrement) => ({
      dateDeDelivrance: new Date(agrement.delivreLe),
      departementDeDelivrance: agrement.delivrePar,
    }));
  }
  if (!response.ok) {
    throw new Error(`L'appel à Pajemploi a échoué`, {
      cause: `Pajemploi a renvoyé une erreur ${response.status}`,
    });
  }
};
export { rechercher };
