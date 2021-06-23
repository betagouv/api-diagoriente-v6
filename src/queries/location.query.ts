import { GraphQLString, GraphQLInt, GraphQLList } from 'graphql';
import { LocationType } from 'types/location.type';
import axios from 'axios';

export default {
  location: {
    type: new GraphQLList(LocationType),
    args: {
      search: { type: GraphQLString },
      limit: { type: GraphQLInt },
    },
    resolve: async (parent: any, args: { search: string; limit: number }) => {
      const limit = args.limit || 20;
      const response = await axios(
        `https://api-adresse.data.gouv.fr/search/?q=${args.search}&limit=${limit}&type=municipality`,
      );

      if (response.status === 200) {
        return response.data.features.map((feature: any) => {
          return {
            ...feature.properties,
            coordinates: feature.geometry.coordinates,
            postcode: feature.properties.postcode,
            citycode: feature.properties.citycode,
          };
        });
      }
      return [];
    },
  },
};
