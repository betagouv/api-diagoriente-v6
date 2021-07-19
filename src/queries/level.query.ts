import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Level from 'models/level.model';

import { LevelType } from 'types/level.type';

export default {
  levels: list(Level, LevelType, { authorizationRoles: [Role.ADMIN] }),
  level: get(Level, LevelType, { authorizationRoles: [Role.ADMIN] }),
};
