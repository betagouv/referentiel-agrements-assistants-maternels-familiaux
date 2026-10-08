import { configuration } from '../configuration.js';
const baseUrl = configuration.dependencies.rnipp.baseUrl;

const existe = async ({ nom }) => {
  const route = 'identite';
  const queryParam = `?name=${nom}`;
  const url = `${baseUrl}/${route}${queryParam}`;
  // eslint-disable-next-line no-undef
  const response = await fetch(url, {
    method: 'GET',
  });
  if (response.ok) return true;
  if (!response.ok) {
    if (response.status === 404) return false;
  }
};
export { existe };
