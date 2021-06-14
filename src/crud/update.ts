import { isEmpty } from 'lodash';
import { GraphQLType, GraphQLNonNull, GraphQLID, GraphQLError } from 'graphql';
import { Model, Document } from 'mongoose';
import { apiWrapper, Options } from './apiWrapper';
import transformObject from 'utils/transformObject';

function update<T extends Document, A extends { [key: string]: GraphQLType }, C extends { id: string }>(
  model: Model<T>,
  args: A,
  type: GraphQLType,
  options: Options<T, { [K in keyof A | 'id']: { type: A[K] } }, C> = {},
) {
  return apiWrapper(
    async (args) => {
      const { id, query = {}, ...rest } = args;
      if (isEmpty(rest)) throw new GraphQLError('Vous devez renseigner au moins un élément pour valider');
      const doc = await model.findOneAndUpdate({ _id: id, ...query }, rest as any, { new: true });
      if (!doc) throw new GraphQLError('Le document est introuvable');
      return doc;
    },
    type,
    {
      ...transformObject(args, (value) => {
        return { type: value };
      }),
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    options,
  );
}

export default update;
