import { GraphQLList, GraphQLString } from 'graphql';
import { uniq } from 'lodash';
import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Tag from 'models/tag.model';
import Theme from 'models/theme.model';

import { ThemeType } from 'types/theme.type';

export default {
  themes: list(Theme, ThemeType, {
    authorizationRoles: [Role.ADMIN, Role.USER],
    args: { sector: { type: GraphQLString }, tags: { type: new GraphQLList(GraphQLString) } },
    pre: async (args) => {
      const { sector, tags, ...rest } = args;
      if (sector) {
        const extraTags = await Tag.find({ sector });
        tags.push(...extraTags.map((tag) => tag.id.toString()));
      }

      return tags.length ? { ...rest, tag: { $in: uniq(tags) } } : rest;
    },
  }),
  theme: get(Theme, ThemeType, { authorizationRoles: [Role.ADMIN, Role.USER] }),
};
