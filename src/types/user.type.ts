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

import { SkillType } from 'types/skill.type';
import { VolunteerType } from 'types/volunteer.type';
import { CursorType } from './cursor.type';
import { InterestType } from './interest.type';

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

export const UserInterestType = new GraphQLObjectType({
  name: 'UserInterest',
  fields: {
    interest: { type: InterestType },
    cursors: { type: new GraphQLList(CursorType) },
  },
});

export const UserType: GraphQLObjectType<any, any> = new GraphQLObjectType({
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
    skills: { type: new GraphQLList(SkillType) },
    volunteers: { type: new GraphQLList(VolunteerType) },
    interests: { type: new GraphQLList(UserInterestType) },
  },
});
