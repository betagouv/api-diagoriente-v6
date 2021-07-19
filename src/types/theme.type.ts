import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLEnumType, GraphQLList, GraphQLInt } from 'graphql';
import { ThemeDomain, ThemeScope } from 'models/theme.model';
import { ActivityType } from './activity.type';
import { LevelType } from './level.type';
import { ReferenceType } from './reference.type';

export const ThemeScopeType = new GraphQLEnumType({
  name: 'ThemeScope',
  values: {
    [ThemeScope.SKILL]: { value: ThemeScope.SKILL },
    [ThemeScope.VOLUNTEER]: { value: ThemeScope.VOLUNTEER },
  },
});

export const ThemeDomainType = new GraphQLEnumType({
  name: 'ThemeDomain',
  values: {
    [ThemeDomain.PERSONAL]: { value: ThemeDomain.PERSONAL },
    [ThemeDomain.PROFESSIONAL]: { value: ThemeDomain.PROFESSIONAL },
    [ThemeDomain.VOLUNTARY]: { value: ThemeDomain.VOLUNTARY },
  },
});

export const ThemeType = new GraphQLObjectType({
  name: 'Theme',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    domain: { type: ThemeDomainType },
    code: { type: GraphQLString },
    tag: { type: GraphQLID },
    activities: { type: new GraphQLList(ActivityType) },
    reference: { type: ReferenceType },
    image: { type: GraphQLString },
    scope: { type: ThemeScopeType },
    level: { type: GraphQLInt },
    levels: { type: new GraphQLList(LevelType) },
  },
});
