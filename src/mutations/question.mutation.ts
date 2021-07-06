import joi from 'joi';
import { GraphQLString, GraphQLID } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Question from 'models/question.model';

import { QuestionType } from 'types/question.type';

const createQuestionValidation = {
  title: joi.string().required(),
  parent: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

const updateQuestionValidation = {
  title: joi.string(),
  parent: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

export default {
  createQuestion: create(
    Question,
    { title: { type: GraphQLString, required: true }, parent: { type: GraphQLID, required: false } },
    QuestionType,
    { validateSchema: createQuestionValidation, authorizationRoles: [Role.ADMIN] },
  ),
  updateQuestion: update(Question, { title: GraphQLString, parent: GraphQLID }, QuestionType, {
    validateSchema: updateQuestionValidation,
    authorizationRoles: [Role.ADMIN],
  }),
  removeQuestion: remove(Question, { authorizationRoles: [Role.ADMIN] }),
};
