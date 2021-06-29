import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInputObjectType } from 'graphql';

import { ReferenceType } from 'types/reference.type';

export const CompetenceLevelsInputType = new GraphQLInputObjectType({
  name: 'CompetenceLevelsInput',
  fields: {
    title: { type: GraphQLString },
    subTitle: { type: GraphQLString },
  },
});

export const CompetenceLevelsType = new GraphQLObjectType({
  name: 'CompetenceLevels',
  fields: {
    title: { type: GraphQLString },
    subTitle: { type: GraphQLString },
  },
});

export const CompetenceType = new GraphQLObjectType({
  name: 'Competence',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    type: { type: GraphQLString },
    levels: { type: new GraphQLList(CompetenceLevelsType) },
    reference: { type: ReferenceType },
  },
});
