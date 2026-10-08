import { configuration } from '../configuration.js';
const baseUrl = configuration.dependencies.rnipp.baseUrl;

const existe = async ({ nom }) => {
  const timeoutMilliseconds = 500;
  const route = 'identite';
  const queryParam = `?name=${nom}`;
  const url = `${baseUrl}/${route}${queryParam}`;

  try {
    // eslint-disable-next-line no-undef
    const response = await fetch(url, {
      method: 'GET',
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
