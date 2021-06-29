import { GraphQLID, GraphQLObjectType, GraphQLString } from 'graphql';
import { UserType } from 'types/user.type';

export const GroupType = new GraphQLObjectType({
  name: 'Group',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    code: { type: GraphQLString },
    advisor: { type: UserType },
  },
});
