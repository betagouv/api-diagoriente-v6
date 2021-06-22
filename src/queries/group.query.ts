import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Group from 'models/group.model';

import { GroupType } from 'types/group.type';

export default {
  groups: list(Group, GroupType, { authorizationRoles: [Role.ADMIN] }),
  group: get(Group, GroupType, { authorizationRoles: [Role.ADMIN] }),
};
