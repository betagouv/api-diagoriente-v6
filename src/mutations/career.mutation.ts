import create from 'crud/create';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Career from 'models/career.model';
import Group from 'models/group.model';

import { CareerType } from 'types/career.type';

export default {
  createCareer: create(Career, {}, CareerType, {
    authorizationRoles: [Role.USER],
    pre: async (args, req) => {
      const { user } = req;
      const group = await Group.findOne({ _id: user?.group });
      return { user: user?.id, group: user?.group, advisor: group?.advisor };
    },
  }),
  removeCareer: remove(Career, { authorizationRoles: [Role.ADMIN] }),
};
