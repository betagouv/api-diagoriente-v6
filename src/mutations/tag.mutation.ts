import joi from 'joi';
import { GraphQLString, GraphQLID } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Tag from 'models/tag.model';

import { TagType } from 'types/tag.type';

const createTagValidation = {
  title: joi.string().required(),
  code: joi.string().required(),
  sector: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
};

const updateTagValidation = {
  title: joi.string(),
  code: joi.string(),
  sector: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

export default {
  createTag: create(
    Tag,
    {
      title: { type: GraphQLString, required: true },
      code: { type: GraphQLString, required: true },
      sector: { type: GraphQLID, required: true },
    },
    TagType,
    { validateSchema: createTagValidation, authorizationRoles: [Role.ADMIN] },
  ),
  updateTag: update(Tag, { title: GraphQLString, code: GraphQLString, sector: GraphQLID }, TagType, {
    validateSchema: updateTagValidation,
    authorizationRoles: [Role.ADMIN],
  }),
  removeTag: remove(Tag, { authorizationRoles: [Role.ADMIN] }),
};
