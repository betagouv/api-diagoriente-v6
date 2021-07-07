import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';

import { CompetenceType } from 'types/competence.type';

export const ReferenceType = new GraphQLObjectType({
  name: 'Reference',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    public: { type: GraphQLBoolean },
    competences: { type: GraphQLList(CompetenceType) },
  },
});
