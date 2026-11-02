import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';

import * as agrementRepository from '../repositories/agrement-familial-repository.js';
import * as identiteRepository from '../repositories/identite-repository.js';
import * as personneRepository from '../repositories/personne-repository.js';
import * as utilisateurRepository from '../repositories/utilisateur-repository.js';

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
          dateDelivrance: Joi.date().required(),
        },
      }),
      headers: Joi.object({
        userid: Joi.string().optional(),
      }),
      options: {
        allowUnknown: true,
      },
    },
    handler: async (request, hapi) => {
      const identifiant = request.headers.userid;

      if (identifiant === undefined) {
        return hapi.response().code(StatusCodes.UNAUTHORIZED);
      }

      const utilisateur = await utilisateurRepository.rechercher({ identifiant });
      if (utilisateur === undefined) {
        return hapi.response().code(StatusCodes.FORBIDDEN);
      }

      const nom = request.payload.personne.nom;
      const lIdentiteDeLaPersonneEstValide = await identiteRepository.existe({ nom });
      if (lIdentiteDeLaPersonneEstValide) {
        const dateDeDelivrance = request.payload.agrement.dateDelivrance;
        await personneRepository.persister({ nom });
        await agrementRepository.persister({
          nom,
          dateDeDelivrance,
          departementDeDelivrance: utilisateur.departement,
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
