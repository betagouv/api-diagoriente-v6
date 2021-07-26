import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

export const CursorType = new GraphQLObjectType({
  name: 'Cursor',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    interest: { type: GraphQLID },
    index: { type: GraphQLInt },
  },
});
