import { GraphQLID, GraphQLObjectType } from 'graphql';

import { UserType } from 'types/user.type';
import { GroupType } from 'types/group.type';

export const CareerType = new GraphQLObjectType({
  name: 'Career',
  fields: {
    id: { type: GraphQLID },
    user: { type: UserType },
    advisor: { type: UserType },
    group: { type: GroupType },
  },
});
