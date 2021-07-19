import joi from 'joi';
import { GraphQLString, GraphQLInt, GraphQLID } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Level from 'models/level.model';

import { LevelType } from 'types/level.type';

const createLevelValidation = {
  title: joi.string().required(),
  rank: joi.number().min(1).max(8).required(),
  reference: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
};

const updateLevelValidation = {
  title: joi.string(),
  rank: joi.number().min(1).max(8),
  reference: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

export default {
  createLevel: create(
    Level,
    {
      title: { type: GraphQLString, required: true },
      rank: { type: GraphQLInt, required: true },
      reference: { type: GraphQLID, required: true },
    },
    LevelType,
    { validateSchema: createLevelValidation, authorizationRoles: [Role.ADMIN] },
  ),
  updateLevel: update(Level, { title: GraphQLString, rank: GraphQLInt, reference: GraphQLID }, LevelType, {
    validateSchema: updateLevelValidation,
    authorizationRoles: [Role.ADMIN],
  }),
  removeLevel: remove(Level, { authorizationRoles: [Role.ADMIN] }),
};
