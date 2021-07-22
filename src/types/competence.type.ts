import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLEnumType,
} from 'graphql';

import { CompetenceType as CompetenceTypeEnum } from 'models/competence.model';

export const CompetenceLevelsInputType = new GraphQLInputObjectType({
  name: 'CompetenceLevelsInput',
  fields: {
    title: { type: GraphQLString },
    subTitle: { type: GraphQLString },
  },
});

export const CompetenceTypeType = new GraphQLEnumType({
  name: 'CompetenceType',
  values: {
    [CompetenceTypeEnum.ORGANIZATIONAL]: { value: CompetenceTypeEnum.ORGANIZATIONAL },
    [CompetenceTypeEnum.COMMUNICATION]: { value: CompetenceTypeEnum.COMMUNICATION },
    [CompetenceTypeEnum.REFLECTIVE]: { value: CompetenceTypeEnum.REFLECTIVE },
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
    type: { type: CompetenceTypeType },
    levels: { type: new GraphQLList(CompetenceLevelsType) },
    reference: { type: GraphQLID },
  },
});
