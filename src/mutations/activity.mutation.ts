import joi from 'joi';
import { GraphQLString, GraphQLID } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Activity from 'models/activity.model';

import { ActivityType } from 'types/activity.type';

const createActivityValidation = {
  title: joi.string().required(),
  description: joi.string(),
  theme: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
};

const updateActivityValidation = {
  title: joi.string(),
  description: joi.string(),
  theme: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

export default {
  createActivity: create(
    Activity,
    {
      title: { type: GraphQLString, required: true },
      description: { type: GraphQLString, required: false },
      theme: { type: GraphQLID, required: true },
    },
    ActivityType,
    { validateSchema: createActivityValidation, authorizationRoles: [Role.ADMIN] },
  ),
  updateActivity: update(
    Activity,
    { title: GraphQLString, description: GraphQLString, theme: GraphQLID },
    ActivityType,
    { validateSchema: updateActivityValidation, authorizationRoles: [Role.ADMIN] },
  ),
  removeActivity: remove(Activity, { authorizationRoles: [Role.ADMIN] }),
};
