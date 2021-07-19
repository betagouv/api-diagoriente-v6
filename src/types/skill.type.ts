import { GraphQLID, GraphQLObjectType, GraphQLList, GraphQLString } from 'graphql';
import { GraphQLDate } from 'graphql-iso-date';

import { ThemeType, ThemeDomainType } from 'types/theme.type';
import { ActivityType } from 'types/activity.type';
import { CompetenceType } from 'types/competence.type';

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
    competences: { type: new GraphQLList(CompetenceType) },
    domain: { type: ThemeDomainType },
    startDate: { type: GraphQLDate },
    endDate: { type: GraphQLDate },
  },
});
