import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Competence from 'models/competence.model';

import { CompetenceType } from 'types/competence.type';

export default {
  competences: list(Competence, CompetenceType, { authorizationRoles: [Role.ADMIN] }),
  competence: get(Competence, CompetenceType, { authorizationRoles: [Role.ADMIN] }),
};
