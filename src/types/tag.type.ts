import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { SectorType } from "types/sector.type";

export const TagType = new GraphQLObjectType({
  name: "Tag",
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    code: { type: GraphQLString },
    sector: { type: SectorType },
  },
});
