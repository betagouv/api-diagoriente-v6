import { GraphQLNonNull } from 'graphql';
import apiWrapper from '../crud/apiWrapper';
import { UserType } from '../types/user.type';
import { Role } from '../models/user.model';

export default {
  me: apiWrapper(
    (args, req) => {
      return req.user;
    },
    new GraphQLNonNull(UserType),
    {},
    { authorizationRoles: [Role.USER] },
  ),
};
