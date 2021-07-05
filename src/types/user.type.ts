import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLEnumType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { Role } from 'models/user.model';

export const UserGroupType = new GraphQLObjectType({
  name: 'UserGroup',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    code: { type: GraphQLString },
  },
});

export const UserRole = new GraphQLEnumType({
  name: 'Role',
  values: {
    [Role.ADMIN]: { value: Role.ADMIN },
    [Role.USER]: { value: Role.USER },
    [Role.ADVISOR]: { value: Role.ADVISOR },
  },
});

export const LocationType = new GraphQLObjectType({
  name: 'LocationUser',
  fields: () => ({
    address: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    postCode: { type: GraphQLString },
  }),
});

export const LocationTypeInput = new GraphQLInputObjectType({
  name: 'LocationInput',
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
    group: { type: UserGroupType },
    carriers: { type: GraphQLList(GraphQLID) },
  },
});
