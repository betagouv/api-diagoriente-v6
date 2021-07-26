import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Cursor from 'models/cursor.model';

import { CursorType } from 'types/cursor.type';

export default {
  cursors: list(Cursor, CursorType, { authorizationRoles: [Role.ADMIN] }),
  cursor: get(Cursor, CursorType, { authorizationRoles: [Role.ADMIN] }),
};
