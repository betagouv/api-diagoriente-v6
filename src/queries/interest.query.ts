import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Interest from 'models/interest.model';

import { InterestType } from 'types/interest.type';

export default {
  interests: list(Interest, InterestType, { authorizationRoles: [Role.ADMIN] }),
  interest: get(Interest, InterestType, { authorizationRoles: [Role.ADMIN] }),
};
