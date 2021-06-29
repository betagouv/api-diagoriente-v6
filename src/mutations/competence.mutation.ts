import joi from 'joi';
import { GraphQLString, GraphQLList } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Competence from 'models/competence.model';

import { CompetenceType, CompetenceNiveauInputType } from 'types/competence.type';

const createCompetenceValidation = {
  title: joi.string().max(150).required(),
  type: joi.string().required(),
  niveau: joi.array().items(joi.object({ title: joi.string().max(180), subTitle: joi.string().max(180) })),
};

const updateCompetenceValidation = {
  title: joi.string().max(150),
  type: joi.string(),
  niveau: joi.array().items(joi.object({ title: joi.string().max(180), subTitle: joi.string().max(180) })),
};

export default {
  createCompetence: create(
    Competence,
    {
      title: { type: GraphQLString, required: true },
      type: { type: GraphQLString, required: true },
      niveau: { type: new GraphQLList(CompetenceNiveauInputType), required: false },
    },
    CompetenceType,
    { validateSchema: createCompetenceValidation, authorizationRoles: [Role.ADMIN] },
  ),
  updateCompetence: update(
    Competence,
    { title: GraphQLString, type: GraphQLString, niveau: new GraphQLList(CompetenceNiveauInputType) },
    CompetenceType,
    { validateSchema: updateCompetenceValidation, authorizationRoles: [Role.ADMIN] },
  ),
  removeCompetence: remove(Competence, { authorizationRoles: [Role.ADMIN] }),
};
