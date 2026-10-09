import Joi from 'joi';

import * as agrementRepository from '../repositories/agrement-repository.js';
import * as identiteRepository from '../repositories/identite-repository.js';
import * as personneRepository from '../repositories/personne-repository.js';

const route = {
  method: 'PUT',
  path: '/api/agrement',
  config: {
    auth: false,
    tags: ['api'],
    payload: { allow: 'application/json' },
    validate: {
      payload: Joi.object({
        personne: {
          nom: Joi.string().required(),
        },
        agrement: {
          dateDelivrance: Joi.string().required(),
        },
      }),
    },
    handler: async (request, hapi) => {
      const nom = request.payload.personne.nom;
      const lIdentiteDeLaPersonneEstValide = await identiteRepository.existe({ nom });
      if (lIdentiteDeLaPersonneEstValide) {
        const dateDeDelivrance = request.payload.agrement.dateDelivrance;
        await personneRepository.persister({ nom });
        await agrementRepository.persister({
          nom,
          dateDeDelivrance,
        });
        return hapi.response().code(200);
      } else {
        return hapi.response(`L'identité du demandeur doit être connue dans le RNIPP`).code(400);
      }
    },
    notes: ["Cette route permet de délivrer un agrément d'assistant familial."],
  },
};

export { route };
