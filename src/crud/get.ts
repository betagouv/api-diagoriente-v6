import { GraphQLID, GraphQLType, GraphQLNonNull, GraphQLError } from 'graphql';
import { Model, Document } from 'mongoose';

import { apiWrapper, Options } from './apiWrapper';

function get<T extends Document, C extends { id: string }>(
  model: Model<T>,
  type: GraphQLType,
  options: Options<T, { id: { type: GraphQLType } }, C> = {},
) {
  return apiWrapper(
    async (args) => {
      const { id, ...rest } = args;
      const doc = await model.findOne({ _id: args.id, ...rest });
      if (!doc) throw new GraphQLError('Le document est introuvable');
      return doc;
    },
    type,
    { id: { type: new GraphQLNonNull(GraphQLID) } },
    options,
  );
}

export default get;
