import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';

import { QuestionType } from 'types/question.type';

export const OptionParentType = new GraphQLObjectType({
  name: 'OptionParent',
  fields: {
    path: { type: new GraphQLList(GraphQLID) },
  },
});

export const OptionType: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: 'Option',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    parent: { type: new GraphQLList(OptionParentType) },
    question: { type: QuestionType },
    user: { type: GraphQLID },
    verified: { type: GraphQLBoolean },
  },
});
