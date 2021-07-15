import joi from 'joi';
import { GraphQLString, GraphQLID, GraphQLError } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Activity from 'models/activity.model';

import { ActivityType } from 'types/activity.type';

const createActivityValidation = {
  title: joi.string().required(),
  description: joi.string(),
  code: joi.string(),
  theme: joi.string().regex(/^[0-9a-fA-F]{24}$/),
  tag: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

const updateActivityValidation = {
  title: joi.string(),
  description: joi.string(),
  code: joi.string(),
  theme: joi.string().regex(/^[0-9a-fA-F]{24}$/),
  tag: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

export default {
  createActivity: create(
    Activity,
    {
      title: { type: GraphQLString, required: true },
      description: { type: GraphQLString, required: false },
      theme: { type: GraphQLID, required: false },
      tag: { type: GraphQLID, required: false },
      code: { type: GraphQLString, required: false },
    },
    ActivityType,
    {
      validateSchema: createActivityValidation,
      authorizationRoles: [Role.ADMIN],
      pre: (args) => {
        if (!args.theme && !args.tag) throw new GraphQLError('Vous devez définir un tag ou un thème');
        return args;
      },
    },
  ),
  updateActivity: update(
    Activity,
    { title: GraphQLString, description: GraphQLString, theme: GraphQLID },
    ActivityType,
    { validateSchema: updateActivityValidation, authorizationRoles: [Role.ADMIN] },
  ),
  removeActivity: remove(Activity, { authorizationRoles: [Role.ADMIN] }),
};
