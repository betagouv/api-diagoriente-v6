import joi from 'joi';
import { GraphQLString, GraphQLInt, GraphQLID, GraphQLList } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Level, { levelTypes } from 'models/level.model';

import { LevelType } from 'types/level.type';
import { competenceTypes } from 'models/competence.model';

const createLevelValidation = {
  title: joi.string().required(),
  rank: joi.number().min(1).max(8).required(),
  reference: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  type: joi
    .string()
    .valid(...levelTypes)
    .required(),
  competenceTypes: joi
    .array()
    .items(joi.string().valid(...competenceTypes))
    .unique(),
};

const updateLevelValidation = {
  title: joi.string(),
  rank: joi.number().min(1).max(8),
  reference: joi.string().regex(/^[0-9a-fA-F]{24}$/),
  type: joi.string().valid(...levelTypes),
  competenceType: joi
    .array()
    .items(joi.string().valid(...competenceTypes))
    .unique(),
};

export default {
  createLevel: create(
    Level,
    {
      title: { type: GraphQLString, required: true },
      rank: { type: GraphQLInt, required: true },
      reference: { type: GraphQLID, required: true },
      type: { type: GraphQLString, required: true },
      competenceTypes: { type: new GraphQLList(GraphQLString), required: false },
    },
    LevelType,
    { validateSchema: createLevelValidation, authorizationRoles: [Role.ADMIN] },
  ),
  updateLevel: update(
    Level,
    {
      title: GraphQLString,
      rank: GraphQLInt,
      reference: GraphQLID,
      type: GraphQLString,
      competenceTypes: new GraphQLList(GraphQLString),
    },
    LevelType,
    {
      validateSchema: updateLevelValidation,
      authorizationRoles: [Role.ADMIN],
    },
  ),
  removeLevel: remove(Level, { authorizationRoles: [Role.ADMIN] }),
};
