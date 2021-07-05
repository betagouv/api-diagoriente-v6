import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLEnumType, GraphQLList } from 'graphql';
import { ThemeDomain } from 'models/theme.model';
import { ActivityType } from './activity.type';
import { ReferenceType } from './reference.type';

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
    activities: { type: GraphQLList(ActivityType) },
    reference: { type: ReferenceType },
    image: { type: GraphQLString },
  },
});
