import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export const SectorType = new GraphQLObjectType({
  name: "Sector",
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    code: { type: GraphQLString },
  },
});
