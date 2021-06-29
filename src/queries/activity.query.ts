import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Activity from 'models/activity.model';

import { ActivityType } from 'types/activity.type';

export default {
  activities: list(Activity, ActivityType, { authorizationRoles: [Role.ADMIN] }),
  activity: get(Activity, ActivityType, { authorizationRoles: [Role.ADMIN] }),
};
