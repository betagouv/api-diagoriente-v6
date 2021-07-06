import { GraphQLID, GraphQLObjectType, GraphQLString } from 'graphql';

export const QuestionType = new GraphQLObjectType({
  name: 'Question',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    parent: { type: GraphQLID },
  },
});
