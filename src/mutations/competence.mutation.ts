import joi from 'joi';
import { GraphQLString, GraphQLList, GraphQLID, GraphQLBoolean } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Competence, { competenceTypes } from 'models/competence.model';

import { CompetenceType, CompetenceLevelsInputType } from 'types/competence.type';

const createCompetenceValidation = {
  title: joi.string().max(150).required(),
  type: joi
    .string()
    .required()
    .valid(...competenceTypes),
  levels: joi.array().items(joi.object({ title: joi.string().max(180), subTitle: joi.string().max(180) })),
  reference: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  verified: joi.boolean(),
};

const updateCompetenceValidation = {
  title: joi.string().max(150),
  type: joi.string().valid(...competenceTypes),
  levels: joi.array().items(joi.object({ title: joi.string().max(180), subTitle: joi.string().max(180) })),
  reference: joi.string().regex(/^[0-9a-fA-F]{24}$/),
  verified: joi.boolean(),
};

export default {
  createCompetence: create(
    Competence,
    {
      title: { type: GraphQLString, required: true },
      type: { type: GraphQLString, required: true },
      levels: { type: new GraphQLList(CompetenceLevelsInputType), required: false },
      reference: { type: GraphQLID, required: true },
      verified: { type: GraphQLBoolean, required: false },
    },
    CompetenceType,
    { validateSchema: createCompetenceValidation, authorizationRoles: [Role.ADMIN] },
  ),
  updateCompetence: update(
    Competence,
    {
      title: GraphQLString,
      type: GraphQLString,
      levels: new GraphQLList(CompetenceLevelsInputType),
      reference: GraphQLID,
      verified: GraphQLBoolean,
    },
    CompetenceType,
    { validateSchema: updateCompetenceValidation, authorizationRoles: [Role.ADMIN] },
  ),
  removeCompetence: remove(Competence, { authorizationRoles: [Role.ADMIN] }),
};
