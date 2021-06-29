import joi from 'joi';
import { GraphQLString, GraphQLBoolean } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Reference from 'models/reference.model';

import { ReferenceType } from 'types/reference.type';

const createReferenceValidation = {
  title: joi.string().required(),
  public: joi.boolean(),
};

const updateReferenceValidation = {
  title: joi.string(),
  public: joi.boolean(),
};

export default {
  createReference: create(
    Reference,
    {
      title: { type: GraphQLString, required: true },
      public: { type: GraphQLBoolean, required: false },
    },
    ReferenceType,
    {
      validateSchema: createReferenceValidation,
      authorizationRoles: [Role.ADMIN, Role.ADVISOR],
      pre: (args, req) => {
        if (req.user?.role === Role.ADVISOR) {
          return { ...args, advisor: req.user.id };
        }
        return args;
      },
    },
  ),
  updateReference: update(Reference, { title: GraphQLString, public: GraphQLBoolean }, ReferenceType, {
    validateSchema: updateReferenceValidation,
    authorizationRoles: [Role.ADMIN, Role.ADVISOR],
    pre: (args, req) => {
      if (req.user?.role === Role.ADVISOR) {
        return { query: { advisor: req.user.id }, ...args };
      }
      return { query: { advisor: { $exists: false } }, ...args };
    },
  }),
  removeReference: remove(Reference, { authorizationRoles: [Role.ADMIN] }),
};
