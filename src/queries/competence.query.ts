import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Competence from 'models/competence.model';

import { CompetenceType } from 'types/competence.type';

export default {
  competences: list(Competence, CompetenceType, {
    authorizationRoles: [Role.ADMIN, Role.USER],
    pre: (args, req) => {
      const query = args || {};
      if (req.user?.role === Role.USER) query.verified = true;
      return query;
    },
  }),
  competence: get(Competence, CompetenceType, { authorizationRoles: [Role.ADMIN] }),
};
