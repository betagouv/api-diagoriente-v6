import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLEnumType, GraphQLList } from 'graphql';

import { LevelType as LevelTypeEnum } from 'models/level.model';
import { CompetenceTypeType } from './competence.type';

export const LevelTypeType = new GraphQLEnumType({
  name: 'LevelType',
  values: {
    [LevelTypeEnum.RESPONSIBILITY]: { value: LevelTypeEnum.RESPONSIBILITY },
    [LevelTypeEnum.COMPLEXITY]: { value: LevelTypeEnum.COMPLEXITY },
    [LevelTypeEnum.ENVIRONMENT]: { value: LevelTypeEnum.ENVIRONMENT },
  },
});

export const LevelType = new GraphQLObjectType({
  name: 'Level',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    rank: { type: GraphQLInt },
    reference: { type: GraphQLID },
    type: { type: LevelTypeType },
    competenceTypes: { type: new GraphQLList(CompetenceTypeType) },
  },
});
