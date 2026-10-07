const existe = async ({ nom }) => {
  // eslint-disable-next-line no-undef
  const response = await fetch(`https://rnipp/identite?name=${nom}`, {
    method: 'GET',
  });
  if (response.ok) return true;
  if (!response.ok) {
    if (response.status === 404) return false;
  }
};
export { existe };
