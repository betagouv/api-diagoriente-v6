import apiWrapper from 'crud/apiWrapper';
import { GraphQLString } from 'graphql';

export default {
  status: apiWrapper(() => 'OK', GraphQLString, {}),
};
