import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';

export const InterestCursorType = new GraphQLObjectType({
  name: 'InterestCursor',
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
  },
});

export const InterestType = new GraphQLObjectType({
  name: 'Interest',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    cursors: { type: new GraphQLList(new GraphQLList(InterestCursorType)) },
  },
});
