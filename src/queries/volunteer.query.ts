import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Volunteer from 'models/volunteer.model';

import { VolunteerType } from 'types/volunteer.type';

export default {
  volunteers: list(Volunteer, VolunteerType, {
    authorizationRoles: [Role.USER],
    pre: (args, req) => {
      return { ...args, user: req.user?.id };
    },
  }),
  volunteer: get(Volunteer, VolunteerType, {
    authorizationRoles: [Role.USER],
    pre: (args, req) => {
      return { ...args, user: req.user?.id };
    },
  }),
};
