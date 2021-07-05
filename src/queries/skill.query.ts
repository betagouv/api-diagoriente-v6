import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Skill from 'models/skill.model';

import { SkillType } from 'types/skill.type';

export default {
  skills: list(Skill, SkillType, { authorizationRoles: [Role.ADMIN] }),
  skill: get(Skill, SkillType, { authorizationRoles: [Role.ADMIN] }),
};
