import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';

import { UserType } from 'types/user.type';

export const ReferenceType = new GraphQLObjectType({
  name: 'Reference',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    advisor: { type: UserType },
    public: { type: GraphQLBoolean },
  },
});
