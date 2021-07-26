import joi from 'joi';
import { GraphQLString, GraphQLInt } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Cursor from 'models/cursor.model';

import { CursorType } from 'types/cursor.type';

const createCursorValidation = {
  title: joi.string().required(),
  interest: joi.string().required(),
  index: joi.number().required(),
};

const updateCursorValidation = {
  title: joi.string(),
  interest: joi.string(),
  index: joi.number(),
};

export default {
  createCursor: create(
    Cursor,
    {
      title: { type: GraphQLString, required: true },
      interest: { type: GraphQLString, required: true },
      index: { type: GraphQLInt, required: true },
    },
    CursorType,
    { validateSchema: createCursorValidation, authorizationRoles: [Role.ADMIN] },
  ),
  updateCursor: update(Cursor, { title: GraphQLString, interest: GraphQLString, index: GraphQLInt }, CursorType, {
    validateSchema: updateCursorValidation,
    authorizationRoles: [Role.ADMIN],
  }),
  removeCursor: remove(Cursor, { authorizationRoles: [Role.ADMIN] }),
};
