import { GraphQLID, GraphQLObjectType, GraphQLList, GraphQLInputObjectType, GraphQLInt } from 'graphql';

import { CareerType } from 'types/career.type';
import { ThemeType } from 'types/theme.type';
import { ActivityType } from 'types/activity.type';
import { CompetenceType } from 'types/competence.type';

export const SkillCompetencesInputType = new GraphQLInputObjectType({
  name: 'SkillCompetencesInput',
  fields: {
    competence: { type: GraphQLID },
    value: { type: GraphQLInt },
  },
});

export const SkillCompetencesType = new GraphQLObjectType({
  name: 'SkillCompetences',
  fields: {
    competence: { type: CompetenceType },
    value: { type: GraphQLInt },
  },
});

export const SkillType = new GraphQLObjectType({
  name: 'Skill',
  fields: {
    id: { type: GraphQLID },
    career: { type: CareerType },
    theme: { type: ThemeType },
    activities: { type: new GraphQLList(ActivityType) },
    competences: { type: new GraphQLList(SkillCompetencesType) },
  },
});
