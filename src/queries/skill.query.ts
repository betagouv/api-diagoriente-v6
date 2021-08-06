import { GraphQLID, GraphQLNonNull, GraphQLString, GraphQLError } from 'graphql';
import { compare } from 'bcryptjs';

import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Skill from 'models/skill.model';
import Recommendation from 'models/recommendation.model';

import { SkillType } from 'types/skill.type';
import apiWrapper from 'crud/apiWrapper';

export default {
  skills: list(Skill, SkillType, {
    args: {
      domain: { type: GraphQLString },
    },
    authorizationRoles: [Role.USER],
    pre: (args, req) => {
      return { ...args, user: req.user?.id };
    },
  }),
  skill: get(Skill, SkillType, {
    authorizationRoles: [Role.USER],
    pre: (args, req) => {
      return { ...args, user: req.user?.id };
    },
  }),
  publicSkill: apiWrapper(
    async (args) => {
      const recommendation = await Recommendation.findById(args.id);
      if (!recommendation || !(await compare(args.secret, recommendation.secret))) {
        throw new GraphQLError('Recommendation introuvable');
      }
      return Skill.findById(recommendation.skill);
    },
    SkillType,
    {
      id: { type: GraphQLNonNull(GraphQLID) },
      secret: { type: GraphQLNonNull(GraphQLString) },
    },
  ),
};
