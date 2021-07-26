import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { CursorType } from './cursor.type';

export const InterestType = new GraphQLObjectType({
  name: 'Interest',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    cursors: { type: new GraphQLList(new GraphQLList(CursorType)) },
  },
});
