import { GraphQLList, GraphQLString } from 'graphql';
import { uniq } from 'lodash';
import list from 'crud/list';
import get from 'crud/get';
import { reg } from 'utils/regs';

import { Role } from 'models/user.model';
import Tag from 'models/tag.model';
import Theme from 'models/theme.model';

import { ThemeType } from 'types/theme.type';

export default {
  themes: list(Theme, ThemeType, {
    authorizationRoles: [Role.ADMIN, Role.USER],
    args: {
      sector: { type: GraphQLString },
      title: { type: GraphQLString },
      domain: { type: GraphQLString },
      tags: { type: new GraphQLList(GraphQLString) },
    },
    pre: async (args) => {
      const { sector, tags, title, ...rest } = args;
      const querySearch = { ...rest };
      if (sector) {
        const extraTags = await Tag.find({ sector });
        tags.push(...extraTags.map((tag) => tag.id.toString()));
      }
      if (title) {
        const titleReg = reg(title);
        querySearch.title = titleReg;
      }
      if (tags?.length) {
        querySearch.tags = { $in: uniq(tags) };
      }

      return querySearch;
    },
  }),
  theme: get(Theme, ThemeType, { authorizationRoles: [Role.ADMIN, Role.USER] }),
};
