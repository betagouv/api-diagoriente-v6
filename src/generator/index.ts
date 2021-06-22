import {
  isEnumType,
  isInputObjectType,
  isObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt,
  isNamedType,
  GraphQLNamedType,
} from 'graphql';
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';
import Schema from 'config/graphql';
import prettier from 'prettier';

import fs from 'fs';
import path from 'path';

const scalarTypes = [
  { name: GraphQLString.name.toString(), ts: 'string' },
  { name: GraphQLID.name.toString(), ts: 'string' },
  { name: GraphQLBoolean.name.toString(), ts: 'boolean' },
  { name: GraphQLInt.name.toString(), ts: 'number' },
  { name: GraphQLFloat.name.toString(), ts: 'number' },
  { name: GraphQLDate.name.toString(), ts: 'Date' },
  { name: GraphQLTime.name.toString(), ts: 'Date' },
  { name: GraphQLDateTime.name.toString(), ts: 'Date' },
];

const config = Schema.toConfig();

function getType(field: string): { name: string; required: boolean } {
  const required = field.endsWith('!');
  if (field.startsWith('[')) return { name: `${getType(field.slice(1, -1)).name}[]`, required };

  const scalar = scalarTypes.find((s) => s.name === field.replace('!', ''));
  if (scalar) {
    return { name: scalar.ts, required };
  }
  return { name: field, required };
}

function getInterface(field: GraphQLNamedType): string {
  if (isNamedType(field)) {
    if (isEnumType(field)) {
      const values = field.getValues();
      return `export type ${field.name} = ${values.map((v) => `'${v.name.toString()}'`).join('|')}`;
    }

    if (isObjectType(field)) {
      const fields = field.getFields();
      return `export interface ${field.name} {${Object.keys(fields)
        .map((f) => {
          const type = fields[f].type.toString();

          const { name } = getType(type);

          return `${f} : ${name}`;
        })
        .join(',\n')} }`;
    }

    if (isInputObjectType(field)) {
      const fields = field.getFields();
      return `export interface ${field.name} {${Object.keys(fields)
        .map((f) => {
          const type = fields[f].type.toString();
          const { name, required } = getType(type);
          return `${f} ${required ? '?' : ''}: ${name}`;
        })
        .join(',\n')} }`;
    }
  }

  return '';
}

const types = config.types
  .reverse()
  .filter((t) => {
    const name = t.name.toString();
    return !(
      name.startsWith('__') ||
      scalarTypes.find((n) => n.name === name) ||
      name === 'Query' ||
      name === 'Mutation'
    );
  })
  .map((type) => {
    return getInterface(type);
  });

fs.writeFileSync(path.join(__dirname, './types.ts'), prettier.format(types.join('\n'), {parser: "typescript"}));
