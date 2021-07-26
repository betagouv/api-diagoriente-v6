import joi from 'joi';
import { GraphQLString, GraphQLID, GraphQLError } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Activity, { activityTypes, ActivityType as ActivityTypeEnum } from 'models/activity.model';
import Theme from 'models/theme.model';
import Tag from 'models/tag.model';

import { ActivityType } from 'types/activity.type';

const createActivityValidation = {
  title: joi.string().required(),
  description: joi.string(),
  code: joi.string(),
  typeId: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  type: joi
    .string()
    .allow(...activityTypes)
    .required(),
};

const updateActivityValidation = {
  title: joi.string(),
  description: joi.string(),
  code: joi.string(),
};

export default {
  createActivity: create(
    Activity,
    {
      title: { type: GraphQLString, required: true },
      description: { type: GraphQLString, required: false },
      type: { type: GraphQLString, required: true },
      typeId: { type: GraphQLID, required: true },
      code: { type: GraphQLString, required: false },
    },
    ActivityType,
    {
      validateSchema: createActivityValidation,
      authorizationRoles: [Role.ADMIN],
      pre: async (args) => {
        const model = args.type === ActivityTypeEnum.THEME ? Theme : Tag;
        const doc = await model.findOne({ _id: args.typeId });
        if (!doc) throw new GraphQLError('Type id est invalide');
        return args;
      },
    },
  ),
  updateActivity: update(Activity, { title: GraphQLString, description: GraphQLString }, ActivityType, {
    validateSchema: updateActivityValidation,
    authorizationRoles: [Role.ADMIN],
  }),
  removeActivity: remove(Activity, { authorizationRoles: [Role.ADMIN] }),
};
