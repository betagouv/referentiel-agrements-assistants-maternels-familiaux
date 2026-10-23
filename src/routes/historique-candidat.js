import Joi from 'joi';

import * as agrementRepository from '../../src/repositories/agrement-repository.js';

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
    const agrementsFamiliaux = await agrementRepository.rechercher({ nom: request.payload.nom });
    const foo = agrementsFamiliaux.map((agrement) => ({
      type: 'familial',
      dateDeDelivrance: agrement.dateDeDelivrance,
    }));
    return hapi
      .response({
        agrements: foo,
      })
      .code(200);
  },
};

export { route };
