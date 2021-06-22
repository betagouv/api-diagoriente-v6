import joi from 'joi';
import { GraphQLString, GraphQLID } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Group from 'models/group.model';

import { GroupType } from 'types/group.type';

const createGroupValidation = {
  title: joi.string().required(),
  code: joi.string().required(),
  advisor: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
};

const updateGroupValidation = {
  title: joi.string(),
  code: joi.string(),
  advisor: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

export default {
  createGroup: create(
    Group,
    {
      title: { type: GraphQLString, required: true },
      code: { type: GraphQLString, required: true },
      advisor: { type: GraphQLID, required: true },
    },
    GroupType,
    { validateSchema: createGroupValidation, authorizationRoles: [Role.ADMIN] },
  ),
  updateGroup: update(Group, { title: GraphQLString, code: GraphQLString, advisor: GraphQLID }, GroupType, {
    validateSchema: updateGroupValidation,
    authorizationRoles: [Role.ADMIN],
  }),
  removeGroup: remove(Group, { authorizationRoles: [Role.ADMIN] }),
};
