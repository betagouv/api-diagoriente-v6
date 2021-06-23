import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Sector from 'models/sector.model';

import { SectorType } from 'types/sector.type';

export default {
  sectors: list(Sector, SectorType, { authorizationRoles: [Role.ADMIN] }),
  sector: get(Sector, SectorType, { authorizationRoles: [Role.ADMIN] }),
};
