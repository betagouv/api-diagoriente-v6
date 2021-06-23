import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLEnumType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLInputObjectType,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { Role } from 'models/user.model';

export const UserRole = new GraphQLEnumType({
  name: 'Role',
  values: {
    [Role.ADMIN]: { value: Role.ADMIN },
    [Role.USER]: { value: Role.USER },
  },
});
export const LocationType = new GraphQLObjectType({
  name: 'locationUser',
  fields: () => ({
    address: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    postCode: { type: GraphQLString },
  }),
});
export const LocationTypeInput = new GraphQLInputObjectType({
  name: 'locationInput',
  fields: () => ({
    address: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    postCode: { type: GraphQLString },
  }),
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    role: { type: UserRole },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    structure: { type: GraphQLString },
    isReferentiel: { type: GraphQLBoolean },
    tutorialStep: { type: GraphQLInt },
    location: { type: LocationType },
    lastLogin: { type: GraphQLDateTime },
    codeGroupe: { type: GraphQLString },
  },
});
