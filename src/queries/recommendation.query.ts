import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Recommendation from 'models/recommendation.model';

import { RecommendationType } from 'types/recommendation.type';

export default {
  recommendations: list(Recommendation, RecommendationType, { authorizationRoles: [Role.ADMIN] }),
  recommendation: get(Recommendation, RecommendationType, { authorizationRoles: [Role.ADMIN] }),
};
