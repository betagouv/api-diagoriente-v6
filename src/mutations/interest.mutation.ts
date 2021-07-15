import joi from 'joi';
import { GraphQLString, GraphQLList } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Interest from 'models/interest.model';

import { InterestType } from 'types/interest.type';

const createInterestValidation = {
  title: joi.string().required(),
  cursors: joi.array().items(joi.array().items(joi.object({ title: joi.string().required() }))),
};

const updateInterestValidation = {
  title: joi.string(),
  cursors: joi.array().items(joi.array().items(joi.object({ title: joi.string() }))),
};

export default {
  createInterest: create(
    Interest,
    {
      title: { type: GraphQLString, required: true },
      cursors: { type: new GraphQLList(new GraphQLList(GraphQLString)), required: false },
    },
    InterestType,
    {
      validateSchema: createInterestValidation,
      authorizationRoles: [Role.ADMIN],
      pre: ({ cursors, ...args }) => ({
        cursors: cursors.map((cursor) => cursor.map((title: string) => ({ title }))),
        ...args,
      }),
    },
  ),
  updateInterest: update(
    Interest,
    { title: GraphQLString, cursors: new GraphQLList(new GraphQLList(GraphQLString)) },
    InterestType,
    {
      validateSchema: updateInterestValidation,
      authorizationRoles: [Role.ADMIN],
      pre: ({ cursors, ...args }) => {
        if (cursors) {
          return {
            cursors: cursors.map((cursor) => cursor.map((title: string) => ({ title }))),
            ...args,
          };
        }
        return args;
      },
    },
  ),
  removeInterest: remove(Interest, { authorizationRoles: [Role.ADMIN] }),
};
