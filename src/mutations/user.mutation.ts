import joi from 'joi';
import { GraphQLError, GraphQLID, GraphQLList } from 'graphql';
import { groupBy, map } from 'lodash';
import apiWrapper from 'crud/apiWrapper';

import { Role } from 'models/user.model';
import User from 'models/user.model';
import Cursor from 'models/cursor.model';

import { UserType } from 'types/user.type';

const updateUserInterestsValidation = {
  interests: joi
    .array()
    .items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .unique()
    .min(1)
    .max(5)
    .required(),
  cursors: joi
    .array()
    .items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .unique()
    .required(),
};

export default {
  updateUserInterests: apiWrapper(
    async (args, req) => {
      const cursors = await Cursor.find({ _id: { $in: args.cursors } });
      const groupedCursors = groupBy(cursors, (cursor) => {
        return cursor.interest.toString();
      });

      if (
        args.interests.length !== Object.keys(groupedCursors).length ||
        !args.interests.find((i: any) => groupedCursors[i])
      ) {
        throw new GraphQLError("Un ou plusieurs centres d'intérêt choisis sans leurs curseurs");
      }
      const user = User.findOneAndUpdate(
        { _id: req.user?.id },
        { interests: map(groupedCursors, (cursors, interest) => ({ interest, cursors: cursors.map((c) => c._id) })) },
        { new: true },
      );
      return user;
    },
    UserType,
    { interests: { type: new GraphQLList(GraphQLID) }, cursors: { type: new GraphQLList(GraphQLID) } },
    {
      validateSchema: updateUserInterestsValidation,
      authorizationRoles: [Role.USER],
    },
  ),
};
