import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLEnumType } from 'graphql';
import { Role } from 'models/user.model';

export const UserRole = new GraphQLEnumType({
  name: 'Role',
  values: {
    [Role.ADMIN]: { value: Role.ADMIN },
    [Role.USER]: { value: Role.USER },
  },
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    role: { type: UserRole },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
  },
});
