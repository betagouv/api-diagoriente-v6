import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import fs from 'fs';
import path from 'path';

function readFolder(p: string) {
  const files = fs.readdirSync(p);
  return files.map((file) => path.join(p, file));
}

function handleGraphQl(p: string) {
  let fields: any = {};

  const files = readFolder(p);
  files.forEach((file) => {
    // eslint-disable-next-line
    const field = fs.statSync(file).isDirectory() ? handleGraphQl(file) : require(file).default;
    if (field) {
      if (typeof field !== 'object') throw new Error(`export from ${file} must be an object but found ${typeof field}`);
      fields = { ...fields, ...field };
    }
  });
  return fields;
}

const query = handleGraphQl(path.join(__dirname, '../queries'));
const mutation = handleGraphQl(path.join(__dirname, '../mutations'));

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: query,
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: mutation,
  }),
});
