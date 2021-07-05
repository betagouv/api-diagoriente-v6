import joi from 'joi';
import { GraphQLString, GraphQLID } from 'graphql';
import { GraphQLUpload } from 'graphql-upload';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Theme, { themeDomains } from 'models/theme.model';
import { validateUpload, saveUpload } from 'utils/upload';

import { ThemeType } from 'types/theme.type';

const createThemeValidation = {
  title: joi.string().required(),
  domain: joi
    .string()
    .valid(...themeDomains)
    .required(),
  code: joi.string().required(),
  tag: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  reference: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
};

const updateThemeValidation = {
  title: joi.string(),
  domain: joi.string().valid(...themeDomains),
  code: joi.string(),
  tag: joi.string().regex(/^[0-9a-fA-F]{24}$/),
  reference: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

export default {
  createTheme: create(
    Theme,
    {
      title: { type: GraphQLString, required: true },
      domain: { type: GraphQLString, required: true },
      code: { type: GraphQLString, required: true },
      tag: { type: GraphQLID, required: true },
      reference: { type: GraphQLID, required: true },
      image: { type: GraphQLUpload, required: false },
    },
    ThemeType,
    {
      validateSchema: createThemeValidation,
      authorizationRoles: [Role.ADMIN],
      pre: async (args) => {
        const { image: file, ...data } = args;
        if (file) {
          const { filename, createReadStream } = await validateUpload(file);
          const stream = createReadStream();
          const image = await saveUpload(filename, stream);
          return { ...data, image };
        }
        return data;
      },
    },
  ),
  updateTheme: update(
    Theme,
    {
      title: GraphQLString,
      domain: GraphQLString,
      code: GraphQLString,
      tag: GraphQLID,
      reference: GraphQLID,
      image: GraphQLUpload,
    },
    ThemeType,
    {
      validateSchema: updateThemeValidation,
      authorizationRoles: [Role.ADMIN],
      pre: async (args) => {
        const { image: file, ...data } = args;
        if (file) {
          const { filename, createReadStream } = await validateUpload(file);
          const stream = createReadStream();
          const image = await saveUpload(filename, stream);
          return { ...data, image };
        }
        return data;
      },
    },
  ),
  removeTheme: remove(Theme, { authorizationRoles: [Role.ADMIN] }),
};
