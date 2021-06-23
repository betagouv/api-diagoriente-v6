import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLFloat } from 'graphql';
export const LocationType = new GraphQLObjectType({
  name: 'location',
  fields: () => ({
    coordinates: { type: new GraphQLList(GraphQLFloat) },
    city: { type: GraphQLString },
    citycode: { type: GraphQLID },
    context: { type: GraphQLString },
    label: { type: GraphQLString },
    name: { type: GraphQLString },
    postcode: { type: GraphQLString },
  }),
});
