import joi from 'joi';
import { GraphQLString, GraphQLID } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Theme, { domains } from 'models/theme.model';

import { ThemeType } from 'types/theme.type';

const createThemeValidation = {
  title: joi.string().required(),
  domain: joi
    .string()
    .valid(...domains)
    .required(),
  code: joi.string().required(),
  tag: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
};

const updateThemeValidation = {
  title: joi.string(),
  domain: joi.string().valid(...domains),
  code: joi.string(),
  tag: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

export default {
  createTheme: create(
    Theme,
    {
      title: { type: GraphQLString, required: true },
      domain: { type: GraphQLString, required: true },
      code: { type: GraphQLString, required: true },
      tag: { type: GraphQLID, required: true },
    },
    ThemeType,
    { validateSchema: createThemeValidation, authorizationRoles: [Role.ADMIN] },
  ),
  updateTheme: update(
    Theme,
    { title: GraphQLString, domain: GraphQLString, code: GraphQLString, tag: GraphQLID },
    ThemeType,
    { validateSchema: updateThemeValidation, authorizationRoles: [Role.ADMIN] },
  ),
  removeTheme: remove(Theme, { authorizationRoles: [Role.ADMIN] }),
};
