import { GraphQLString } from 'graphql';

import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Skill from 'models/skill.model';

import { SkillType } from 'types/skill.type';

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
};
