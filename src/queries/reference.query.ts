import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Reference from 'models/reference.model';

import { ReferenceType } from 'types/reference.type';

export default {
  references: list(Reference, ReferenceType, { authorizationRoles: [Role.ADMIN] }),
  reference: get(Reference, ReferenceType, { authorizationRoles: [Role.ADMIN] }),
};
