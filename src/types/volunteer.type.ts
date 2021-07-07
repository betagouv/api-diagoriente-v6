import { GraphQLID, GraphQLObjectType, GraphQLList, GraphQLString } from 'graphql';

import { ThemeType } from 'types/theme.type';
import { OptionType } from 'types/option.type';

export const VolunteerUserType = new GraphQLObjectType({
  name: 'VolunteerUser',
  fields: {
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    structure: { type: GraphQLString },
  },
});

export const VolunteerType = new GraphQLObjectType({
  name: 'Volunteer',
  fields: {
    id: { type: GraphQLID },
    user: { type: VolunteerUserType },
    theme: { type: ThemeType },
    options: { type: new GraphQLList(new GraphQLList(OptionType)) },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
  },
});
