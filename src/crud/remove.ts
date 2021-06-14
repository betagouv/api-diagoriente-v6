import { GraphQLID, GraphQLList, GraphQLError, GraphQLString, GraphQLType } from 'graphql';
import { Model, Document } from 'mongoose';
import { apiWrapper, Options } from './apiWrapper';

interface RemoveArgs {
  id?: string;
  ids?: string[];
}

function remove<T extends Document, C extends RemoveArgs>(
  model: Model<T>,
  options: Options<string, { [K in keyof RemoveArgs]: { type: GraphQLType } }, C> & { type?: GraphQLType } = {},
) {
  return apiWrapper(
    async (args: { id: string; ids: string[] }) => {
      const { id, ids, ...rest } = args;
      if (!id && !ids) throw new GraphQLError('Vous devez renseigner un ou des identifiant(s)');
      if (id) {
        const doc = await model.findOne({ _id: id, ...rest } as any);
        if (!doc) {
          throw new GraphQLError('Le document est introuvable');
        }
        await model.deleteOne({ _id: doc._id });
        return 'deleted';
      }
      const docs = await model.find({ _id: { $in: ids }, ...rest } as any);
      const notFoundIndex = docs.findIndex((item) => !ids.find((i) => i === item.id.toString()));
      if (notFoundIndex !== -1) throw new GraphQLError(`Le document ${ids[notFoundIndex]} est introuvable`);
      await model.deleteMany({ _id: { $in: ids } } as any);
      return 'deleted';
    },
    options.type || GraphQLString,
    { id: { type: GraphQLID }, ids: { type: GraphQLList(GraphQLID) } },
    options,
  );
}

export default remove;
