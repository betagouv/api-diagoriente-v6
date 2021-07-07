import joi from 'joi';
import { GraphQLID, GraphQLList, GraphQLString, GraphQLError } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Volunteer from 'models/volunteer.model';
import Theme, { ThemeScope } from 'models/theme.model';

import { VolunteerType } from 'types/volunteer.type';

const createVolunteerValidation = {
  user: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  theme: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  options: joi
    .array()
    .items(
      joi
        .array()
        .items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .required(),
    )
    .required(),
  startDate: joi.string().isoDate(),
  endDate: joi.string().isoDate(),
};

const updateVolunteerValidation = {
  user: joi.string().regex(/^[0-9a-fA-F]{24}$/),
  theme: joi.string().regex(/^[0-9a-fA-F]{24}$/),
  options: joi.array().items(joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/))),
  startDate: joi.string().isoDate(),
  endDate: joi.string().isoDate(),
};

export default {
  createVolunteer: create(
    Volunteer,
    {
      theme: { type: GraphQLID, required: true },
      options: { type: new GraphQLList(new GraphQLList(GraphQLID)), required: true },
      startDate: { type: GraphQLString, required: false },
      endDate: { type: GraphQLString, required: false },
    },
    VolunteerType,
    {
      validateSchema: createVolunteerValidation,
      authorizationRoles: [Role.USER],
      pre: async (args, req) => {
        const theme = await Theme.findOne({ _id: args.theme, scope: ThemeScope.VOLUNTEER });
        if (!theme) throw new GraphQLError('Theme introuvable');
        return { ...args, user: req.user?.id };
      },
    },
  ),
  updateVolunteer: update(
    Volunteer,
    {
      theme: GraphQLID,
      options: new GraphQLList(new GraphQLList(GraphQLID)),
      startDate: GraphQLString,
      endDate: GraphQLString,
    },
    VolunteerType,
    {
      validateSchema: updateVolunteerValidation,
      authorizationRoles: [Role.USER],
      pre: (args, req) => {
        return { ...args, query: { user: req.user?.id } };
      },
    },
  ),
  removeVolunteer: remove(Volunteer, {
    authorizationRoles: [Role.USER],
    pre: (args, req) => {
      return { ...args, user: req.user?.id };
    },
  }),
};
