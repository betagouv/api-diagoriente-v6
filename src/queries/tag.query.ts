import { GraphQLString } from 'graphql';

import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Tag from 'models/tag.model';

import { TagType } from 'types/tag.type';

export default {
  tags: list(Tag, TagType, { authorizationRoles: [Role.ADMIN], args: { sector: { type: GraphQLString } } }),
  tag: get(Tag, TagType, { authorizationRoles: [Role.ADMIN] }),
};
