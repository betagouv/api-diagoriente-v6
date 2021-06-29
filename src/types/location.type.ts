import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLFloat } from 'graphql';

export const LocationType = new GraphQLObjectType({
  name: 'Location',
  fields: () => ({
    coordinates: { type: new GraphQLList(GraphQLFloat) },
    city: { type: GraphQLString },
    cityCode: { type: GraphQLID },
    context: { type: GraphQLString },
    label: { type: GraphQLString },
    name: { type: GraphQLString },
    postcode: { type: GraphQLString },
  }),
});
