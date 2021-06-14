import { GraphQLObjectType } from 'graphql';

import { UserType } from './user.type';
import { TokenType } from './token.type';

export const AuthType = new GraphQLObjectType({
  name: 'Auth',
  fields: {
    user: { type: UserType },
    token: { type: TokenType },
  },
});
