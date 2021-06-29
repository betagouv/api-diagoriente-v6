import Group from 'models/group.model';
import { GraphQLError, GraphQLNonNull, GraphQLString } from 'graphql';
import joi from 'joi';

import apiWrapper from 'crud/apiWrapper';
import create from 'crud/create';
import User, { Role } from 'models/user.model';
import RefreshToken from 'models/refreshToken.model';
import { LocationTypeInput } from 'types/user.type';
import { AuthType } from 'types/auth.type';
import { generateTokenResponse, getAgent } from 'utils/authHelpers';

const refreshSchema = {
  email: joi.string().email().required(),
  refreshToken: joi.string().required(),
};

const loginSchema = {
  email: joi.string().email({ minDomainSegments: 2 }).required(),
  password: joi.string().required().min(6).max(128),
};

const registerSchema = {
  email: joi.string().email().required(),
  password: joi.string().min(6).max(30).required(),
  firstName: joi.string().min(1).max(30).trim(true),
  lastName: joi.string().min(1).max(30).trim(true),
  structure: joi.string(),
  code: joi.string(),
  location: joi
    .object({
      address: joi.string().required(),
      lat: joi.number(),
      lng: joi.number(),
      postCode: joi.string(),
    })
    .required(),
};

export default {
  login: apiWrapper(
    async (args, req) => {
      const user = await User.findOne({ email: args.email });
      if (!user || !(await user.passwordMatches(args.password)))
        throw new GraphQLError('Email et mot de passe ne correspondent pas');

      const token = await generateTokenResponse(user, req);

      return { token, user };
    },
    AuthType,
    {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    { validateSchema: loginSchema },
  ),
  register: create(
    User,
    {
      email: { type: GraphQLString, required: true },
      password: { type: GraphQLString, required: true },
      firstName: { type: GraphQLString, required: true },
      lastName: { type: GraphQLString, required: true },
      structure: { type: GraphQLString, required: false },
      code: { type: GraphQLString, required: false },
      location: { type: LocationTypeInput, required: true },
    },
    AuthType,
    {
      validateSchema: registerSchema,
      pre: async (args) => {
        const { code, email, ...rest } = args;
        let group: string | undefined;
        if (args.code) {
          const existCode = await Group.findOne({ code });
          if (!existCode) throw new GraphQLError("Code groupe n'existe pas");
          group = existCode.id;
        }
        if (email) {
          const existEmail = await User.findOne({ email });
          if (existEmail) throw new GraphQLError('Email existe déjà');
        }
        return { ...rest, email, group };
      },
      post: async ({ result: user, request }) => {
        const token = await generateTokenResponse(user, request);
        return { user, token };
      },
    },
  ),
  refresh: apiWrapper(
    async (args, req) => {
      const agent = getAgent(req);
      const refreshToken = await RefreshToken.findOne({
        userEmail: args.email,
        token: args.refreshToken,
        agent,
      });
      const user = await User.findOne({ email: args.email });

      if (!refreshToken || !user) throw new GraphQLError('Invalid token or email');
      const token = await generateTokenResponse(user, req);
      return { user, token };
    },
    AuthType,
    {
      email: { type: new GraphQLNonNull(GraphQLString) },
      refreshToken: { type: new GraphQLNonNull(GraphQLString) },
    },
    {
      validateSchema: refreshSchema,
    },
  ),
  logout: apiWrapper(
    async (args, req) => {
      const { user } = req;
      const agent = getAgent(req);
      if (user) {
        await RefreshToken.remove({ userId: user.id, agent });
      }
      return 'done';
    },
    GraphQLString,
    {},
    { authorizationRoles: [Role.USER, Role.ADMIN, Role.ADVISOR] },
  ),
};
