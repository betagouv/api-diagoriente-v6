import joi from 'joi';
import { GraphQLError, GraphQLID, GraphQLString } from 'graphql';
import { compare } from 'bcryptjs';
import crypto from 'crypto';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Recommendation, { RecommendationStatus } from 'models/recommendation.model';
import Skill from 'models/skill.model';

import { RecommendationType, RecommendationStatusType } from 'types/recommendation.type';
import mailer from 'middlewares/mailer';
import { LocalRequest } from 'crud/apiWrapper';

const createRecommendationValidation = {
  skill: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  email: joi.string().required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  message: joi.string().required(),
};

const updateRecommendationValidation = {
  secret: joi.string().required(),
  response: joi.string().required(),
  status: joi.string().valid(RecommendationStatus.ACCEPTED, RecommendationStatus.REFUSED).required(),
};

export default {
  createRecommendation: create(
    Recommendation,
    {
      skill: { type: GraphQLID, required: true },
      email: { type: GraphQLString, required: true },
      firstName: { type: GraphQLString, required: true },
      lastName: { type: GraphQLString, required: true },
      message: { type: GraphQLString, required: true },
    },
    RecommendationType,
    {
      validateSchema: createRecommendationValidation,
      authorizationRoles: [Role.USER],
      pre: async (args: { skill: string; email: string }, req: LocalRequest) => {
        const skill = await Skill.findOne({ _id: args.skill, user: req.user?.id });
        if (!skill) throw new GraphQLError('Experience introuvable');
        const recommendation = await Recommendation.findOne({ skill: (args as any).skill, email: args.email });
        if (recommendation) throw new GraphQLError('La recommandation existe déjà');

        const secret = crypto.randomBytes(16).toString('base64').replace('==', '');

        return { ...args, secret, status: RecommendationStatus.PENDING };
      },
      post: async ({ result, request, args }) => {
        const { secret } = args;
        await mailer(
          88,
          result.email,
          `${result.firstName} ${result.lastName}`,
          `/recommendation?secret=${encodeURIComponent(secret)}&id=${encodeURIComponent(result.id)}`,
          {
            nomReceipt: result.firstName,
            prenomReceipt: result.lastName,
            message: result.message,
            nom: request.user?.lastName,
            prenom: request.user?.firstName,
            tags: [''],
          },
          `${request.user?.firstName} ${request.user?.lastName} Vous demande une recommandation`,
        );
        return result;
      },
    },
  ),
  updateRecommendation: update(
    Recommendation,
    {
      response: GraphQLString,
      secret: GraphQLString,
      status: RecommendationStatusType,
    },
    RecommendationType,
    {
      validateSchema: updateRecommendationValidation,
      pre: async (args) => {
        const { secret, ...rest } = args;
        const recommendation = await Recommendation.findById(args.id);
        if (!recommendation || !(await compare(args.secret, recommendation.secret))) {
          throw new GraphQLError('Recommendation introuvable');
        }
        return rest;
      },
    },
  ),
  removeRecommendation: remove(Recommendation, { authorizationRoles: [Role.ADMIN] }),
};
