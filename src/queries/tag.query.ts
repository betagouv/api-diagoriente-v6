import { GraphQLString } from 'graphql';
import { reg } from 'utils/regs';

import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Tag from 'models/tag.model';

import { TagType } from 'types/tag.type';

export default {
  tags: list(Tag, TagType, {
    authorizationRoles: [Role.ADMIN, Role.USER],
    args: { sector: { type: GraphQLString }, title: { type: GraphQLString } },
    pre: async (args) => {
      const { title, ...rest } = args;
      const querySearch = { ...rest };
      if (title) {
        const titleReg = reg(title);
        querySearch.title = titleReg;
      }
      return { ...querySearch };
    },
  }),
  tag: get(Tag, TagType, { authorizationRoles: [Role.ADMIN] }),
};
