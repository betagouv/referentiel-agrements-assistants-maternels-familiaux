import Joi from 'joi';

const route = {
  method: 'PUT',
  path: '/api/historique-candidat',
  config: {
    auth: false,
    tags: ['api'],
    payload: { allow: 'application/json' },
    validate: {
      payload: Joi.object({
        nom: Joi.string().required(),
      }),
    },
  },
  handler: async (request, hapi) => {
    let agrements;
    if (request.payload.nom === 'Dorothy') {
      agrements = [{ type: 'familial', dateDeDelivrance: '2003-01-01' }];
    } else {
      agrements = [];
    }
    return hapi
      .response({
        agrements,
      })
      .code(200);
  },
};

export { route };
