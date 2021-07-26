import { GraphQLID, GraphQLObjectType, GraphQLString } from 'graphql';

export const ActivityType = new GraphQLObjectType({
  name: 'Activity',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    type: { type: GraphQLString },
    typeId: { type: GraphQLID },
    code: { type: GraphQLString },
  },
});
