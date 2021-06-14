import { GraphQLType, GraphQLNonNull } from 'graphql';
import { Model, Document } from 'mongoose';
import apiWrapper, { Options } from './apiWrapper';
import transformObject from 'utils/transformObject';

function create<T extends Document, A extends { [key: string]: { type: GraphQLType; required: boolean } }, C>(
  model: Model<T>,
  args: A,
  type: GraphQLType,
  options: Options<T, A, C> = {},
) {
  return apiWrapper(
    async (args) => {
      let doc = await new model(args);
      doc = await doc.save();
      return doc;
    },
    type,
    transformObject(args, (value) => {
      if (value.required) return { type: new GraphQLNonNull(value.type) };
      return { type: value.type };
    }),
    options,
  );
}

export default create;
