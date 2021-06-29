import { GraphQLString, GraphQLInt, GraphQLList } from 'graphql';
import { LocationType } from 'types/location.type';
import axios from 'axios';
import apiWrapper from 'crud/apiWrapper';

export default {
  location: apiWrapper(
    async (args) => {
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
            cityCode: feature.properties.citycode,
          };
        });
      }
      return [];
    },
    new GraphQLList(LocationType),
    { search: { type: GraphQLString }, limit: { type: GraphQLInt } },
  ),
};
