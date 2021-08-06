import { GraphQLID, GraphQLObjectType, GraphQLEnumType, GraphQLString } from 'graphql';

import { RecommendationStatus } from 'models/recommendation.model';

export const RecommendationStatusType = new GraphQLEnumType({
  name: 'RecommendationStatus',
  values: {
    [RecommendationStatus.ACCEPTED]: { value: RecommendationStatus.ACCEPTED },
    [RecommendationStatus.REFUSED]: { value: RecommendationStatus.REFUSED },
    [RecommendationStatus.PENDING]: { value: RecommendationStatus.PENDING },
  },
});

export const RecommendationType = new GraphQLObjectType({
  name: 'Recommendation',
  fields: {
    id: { type: GraphQLID },
    skill: { type: GraphQLID },
    status: { type: RecommendationStatusType },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    message: { type: GraphQLString },
    response: { type: GraphQLString },
  },
});
