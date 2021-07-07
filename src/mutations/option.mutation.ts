import joi from 'joi';
import { GraphQLString, GraphQLList, GraphQLID, GraphQLBoolean, GraphQLError } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Option from 'models/option.model';

import { OptionType } from 'types/option.type';

const createOptionValidation = {
  title: joi.string().min(3).max(250).required(),
  parent: joi.array().items(joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/))),
  question: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

const updateOptionValidation = {
  title: joi.string().min(3).max(250),
  parent: joi.array().items(joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/))),
  question: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

export default {
  createOption: create(
    Option,
    {
      title: { type: GraphQLString, required: true },
      parent: {
        type: new GraphQLList(new GraphQLList(GraphQLID)),
        required: false,
      },
      question: { type: GraphQLID, required: true },
      verified: { type: GraphQLBoolean, required: false },
    },
    OptionType,
    {
      validateSchema: createOptionValidation,
      authorizationRoles: [Role.USER, Role.ADMIN],
      pre: async (args, req) => {
        const { user } = req;
        if (user?.role === Role.USER) {
          const option = await Option.findOne({
            question: args.question,
            'parent.path': args.parent[0],
            title: '___plus___',
          });
          if (!option) {
            return new GraphQLError('Option Introuvable');
          }
        }

        if (args.parent) args.parent = args.parent.map((path: string[]) => ({ path }));

        if (user?.role === Role.USER) return { ...args, user: user.id, verified: false };
        return args;
      },
    },
  ),
  updateOption: update(
    Option,
    {
      title: GraphQLString,
      parent: new GraphQLList(new GraphQLList(GraphQLID)),
      question: GraphQLID,
      verified: GraphQLBoolean,
    },
    OptionType,
    {
      validateSchema: updateOptionValidation,
      authorizationRoles: [Role.ADMIN],
      pre: (args) => {
        if (args.parent) args.parent = args.parent.map((path: string[]) => ({ path }));

        return args;
      },
    },
  ),
  deleteOption: remove(Option, {
    authorizationRoles: [Role.ADMIN, Role.USER],
    pre: (args, req) => {
      if (req.user && req.user.role === Role.USER) {
        return { ...args, user: req.user.id };
      }
      return args;
    },
  }),
};
