import { GraphQLID, GraphQLObjectType, GraphQLList, GraphQLInputObjectType, GraphQLInt, GraphQLString } from 'graphql';
import { GraphQLDate } from 'graphql-iso-date';

import { ThemeType, ThemeDomainType } from 'types/theme.type';
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
    competences: { type: new GraphQLList(SkillCompetencesType) },
    domain: { type: ThemeDomainType },
    startDate: { type: GraphQLDate },
    endDate: { type: GraphQLDate },
  },
});
