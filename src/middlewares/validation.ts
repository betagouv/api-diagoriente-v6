import { isEmpty } from 'lodash';
import { Schema, isSchema } from 'joi';
import { GraphQLError } from 'graphql';

export interface ISchemaObject {
  [key: string]: Schema | ISchemaObject;
}

export default function (schema: ISchemaObject, args: any) {
  function validate(entry: any, schema: any, key?: string) {
    if (isSchema(schema)) {
      const { error } = schema.validate(entry);
      if (!error) return {};
      if (!key) return error.details[0].type;
      return {
        [key]: error.details[0].type,
      };
    }

    let result = {};
    const keys = Object.keys(schema);
    keys.forEach((key) => {
      result = { ...result, ...validate(entry ? entry[key] : null, schema[key], key) };
    });

    return result;
  }

  const errors = validate(args, schema);
  if (!isEmpty(errors)) {
    throw new GraphQLError({ message: 'Erreur(s) de saisie', originalError: errors } as any);
  }
}
