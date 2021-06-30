import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';

import { UserType } from 'types/user.type';
import { CompetenceType } from 'types/competence.type';

export const ReferenceType = new GraphQLObjectType({
  name: 'Reference',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    advisor: { type: UserType },
    public: { type: GraphQLBoolean },
    competences: { type: GraphQLList(CompetenceType) },
  },
});
