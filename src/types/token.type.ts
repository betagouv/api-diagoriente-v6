import { GraphQLObjectType, GraphQLString } from 'graphql';

export const TokenType = new GraphQLObjectType({
  name: 'token',
  fields: {
    tokenType: { type: GraphQLString },
    accessToken: {
      type: GraphQLString,
    },
    refreshToken: { type: GraphQLString },
    expiresIn: { type: GraphQLString },
  },
});
