import joi from 'joi';
import { GraphQLString } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Group from 'models/group.model';

import { GroupType } from 'types/group.type';

const createGroupValidation = {
  title: joi.string().required(),
  code: joi.string().required(),
};

const updateGroupValidation = {
  title: joi.string(),
};

export default {
  createGroup: create(
    Group,
    {
      title: { type: GraphQLString, required: true },
      code: { type: GraphQLString, required: true },
    },
    GroupType,
    {
      validateSchema: createGroupValidation,
      authorizationRoles: [Role.ADVISOR],
      pre: (args, req) => {
        return { ...args, advisor: req.user?.id };
      },
    },
  ),
  updateGroup: update(Group, { title: GraphQLString }, GroupType, {
    validateSchema: updateGroupValidation,
    authorizationRoles: [Role.ADVISOR],
    pre: (args, req) => {
      return { ...args, query: { advisor: req.user?.id } };
    },
  }),
  removeGroup: remove(Group, {
    authorizationRoles: [Role.ADVISOR],
    pre: (args, req) => {
      return { ...args, advisor: req.user?.id };
    },
  }),
};
