import { GraphQLString, GraphQLID } from 'graphql';

import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Option from 'models/option.model';

import { OptionType } from 'types/option.type';

import { reg } from 'utils/regs';

export default {
  options: list(Option, OptionType, {
    authorizationRoles: [Role.USER, Role.ADMIN],
    args: { search: { type: GraphQLString }, question: { type: GraphQLID }, parent: { type: GraphQLID } },
    pre: async (args, req) => {
      const { user } = req;
      const { search, parent, ...rest } = args;

      const searchReg = reg(search);
      const query: any = { title: searchReg, ...rest };

      if (parent === '') query.parent = { $size: 0 };
      else if (parent) {
        const path = parent.split(',');
        const relatedOptions = await Option.find({ _id: { $in: path } });
        const index = relatedOptions.findIndex((o) => o.user);
        if (index !== -1) {
          const relatedPlaceholder = await Option.findOne({
            title: '___plus___',
            'parent.path': path.slice(0, index),
            user: { $exists: false },
          });
          if (relatedPlaceholder) {
            path[index] = relatedPlaceholder.id.toString();
          }
        }
        query['parent.path'] = path;
      }
      if (user?.role === 'user') {
        query.$or = [{ verified: true }, { user: user.id }];
      }
      return query;
    },
  }),
  option: get(Option, OptionType, { authorizationRoles: [Role.ADMIN] }),
};
