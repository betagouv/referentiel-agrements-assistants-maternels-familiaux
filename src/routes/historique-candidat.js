import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';

import * as agrementFamilialRepository from '../repositories/agrement-familial-repository.js';
import * as agrementMaternelRepository from '../repositories/agrement-maternel-repository.js';
import * as identiteRepository from '../repositories/identite-repository.js';

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
    const laPersonneNExistePas = !(await identiteRepository.existe({ nom }));

    if (laPersonneNExistePas) {
      return hapi
        .response({ cause: "L'identité du demandeur doit être connue dans le RNIPP" })
        .code(StatusCodes.BAD_REQUEST);
    }
    const agrementsMaternels = await agrementMaternelRepository.rechercher({ nom });
    const agrementsFamiliaux = await agrementFamilialRepository.rechercher({ nom });
    return hapi
      .response({
        agrements: [
          ...agrementsFamiliaux.map((agrement) => ({
            type: 'familial',
            dateDeDelivrance: agrement.dateDeDelivrance,
          })),
          ...agrementsMaternels.map((agrement) => ({
            type: 'maternel',
            dateDeDelivrance: agrement.dateDeDelivrance,
            departementDeDelivrance: agrement.departementDeDelivrance,
          })),
        ],
      })
      .code(StatusCodes.OK);
  },
};

export { route };
