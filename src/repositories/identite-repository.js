import { configuration } from '../configuration.js';
const baseUrl = configuration.dependencies.rnipp.baseUrl;
const timeoutMilliseconds = configuration.dependencies.rnipp.timeout;

const existe = async ({ nom }) => {
  const method = 'PUT';
  const route = 'identite';
  const url = `${baseUrl}/${route}`;
  const body = JSON.stringify({ nom });
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    // eslint-disable-next-line no-undef
    const response = await fetch(url, {
      method,
      headers,
      body,
      // eslint-disable-next-line no-undef
      signal: AbortSignal.timeout(timeoutMilliseconds),
    });
    if (response.ok) return true;
    if (!response.ok) {
      if (response.status === 404) {
        return false;
      } else {
        throw new Error(`L'appel au RNIPP a renvoyé une erreur ${response.status}`);
      }
    }
  } catch (error) {
    if (error.name === 'TimeoutError') {
      // eslint-disable-next-line preserve-caught-error
      throw new Error(`L'appel au RNIPP a pris plus de ${timeoutMilliseconds} ms.`);
    } else {
      throw new Error(`L'appel au RNIPP a échoué`, { cause: error });
    }
  }
};
export { existe };
