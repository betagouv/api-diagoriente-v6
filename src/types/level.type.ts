import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

export const LevelType = new GraphQLObjectType({
  name: 'Level',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    rank: { type: GraphQLInt },
    reference: { type: GraphQLID },
  },
});
