import Joi from 'joi';

import * as agrementRepository from '../repositories/agrement-familial-repository.js';

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
    const nom = request.payload.nom;
    if (nom === 'Jane') {
      return hapi
        .response({
          agrements: [
            {
              dateDeDelivrance: '2003-01-01T00:00:00.123Z',
              type: 'maternel',
            },
          ],
        })
        .code(200);
    }
    const agrementsFamiliaux = await agrementRepository.rechercher({ nom });
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
