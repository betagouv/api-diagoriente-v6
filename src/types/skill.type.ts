import { GraphQLID, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { GraphQLDate } from 'graphql-iso-date';

import { ThemeType, ThemeDomainType } from 'types/theme.type';
import { ActivityType } from 'types/activity.type';
import { CompetenceType } from 'types/competence.type';
import { LevelType } from './level.type';
import { RecommendationType } from './recommendation.type';

export const SkillRankType = new GraphQLObjectType({
  name: 'SkillRank',
  fields: {
    competence: { type: CompetenceType },
    level: { type: LevelType },
    rank: { type: GraphQLInt },
  },
});

export const SkillUserType = new GraphQLObjectType({
  name: 'SkillUser',
  fields: {
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    structure: { type: GraphQLString },
  },
});

export const SkillType = new GraphQLObjectType({
  name: 'Skill',
  fields: {
    id: { type: GraphQLID },
    user: { type: SkillUserType },
    theme: { type: ThemeType },
    activities: { type: new GraphQLList(ActivityType) },
    domain: { type: ThemeDomainType },
    startDate: { type: GraphQLDate },
    endDate: { type: GraphQLDate },
    ranks: { type: new GraphQLList(SkillRankType) },
    extraActivity: { type: GraphQLString },
    recommendations: { type: new GraphQLList(RecommendationType) },
  },
});
