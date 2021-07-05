import get from 'crud/get';

import { Role } from 'models/user.model';
import Career from 'models/career.model';

import { CareerType } from 'types/career.type';

export default {
  career: get(Career, CareerType, {
    authorizationRoles: [Role.USER],
    pre: (args, req) => {
      return { ...args, user: req.user?.id };
    },
  }),
};
