import { isEmpty } from 'lodash';
import { GraphQLList, GraphQLType, GraphQLObjectType, GraphQLInt, GraphQLResolveInfo, GraphQLString } from 'graphql';
import joi from 'joi';
import { Model, DocumentQuery, Document } from 'mongoose';
import { apiWrapper, Options, LocalRequest } from './apiWrapper';

const listTypes: { [key: string]: GraphQLObjectType<any, any> } = {};

const listType = (type: GraphQLType) => {
  let existedType = listTypes[`${type}List`];
  if (!existedType) {
    existedType = new GraphQLObjectType({
      name: `${type}List`,
      fields: () => ({
        count: { type: GraphQLInt },
        page: { type: GraphQLInt },
        data: { type: new GraphQLList(type) },
        perPage: { type: GraphQLInt },
        totalPages: { type: GraphQLInt },
      }),
    });
    listTypes[`${type}List`] = existedType;
  }
  return existedType;
};

const listValidationSchema = {
  page: joi.number().min(1),
  perPage: joi.number().min(1).max(3000),
};

function list<T extends Document, Q, A extends { [key: string]: { type: GraphQLType } }, C>(
  model: Model<T, Q extends undefined ? Record<string, never> : Q>,
  type: GraphQLObjectType,
  options: Options<DocumentQuery<T[], T> & Q, A, C> & {
    args?: { [key: string]: { type: GraphQLType } };
  } = {},
) {
  let args = {
    page: { type: GraphQLInt },
    perPage: { type: GraphQLInt },
    sort: { type: GraphQLString },
    order: { type: GraphQLInt },
  };

  let initialArgs: any = {};

  if (options.args) {
    args = { ...args, ...options.args };
  }

  async function pre(
    a: { page: number; perPage: number; order: string; sort: number } & { [K in keyof A]: any },
    req: LocalRequest,
  ) {
    initialArgs = a;
    const args = { ...a };
    if (!args.perPage) args.perPage = args.page ? 10 : -1;
    if (!args.page) args.page = 1;
    return options.pre ? await options.pre(args, req) : args;
  }

  async function getList(
    args: { page: number; perPage: number; sort: string; order: number } & { [K in keyof A]: any },
    req: LocalRequest,
    info: GraphQLResolveInfo,
  ) {
    const { perPage, page, sort: sortArgs, order, ...rest } = args;
    let count = 0;
    if (isEmpty(rest)) count = await model.estimatedDocumentCount(rest);
    else count = await model.find(rest as any).countDocuments();
    const sort = sortArgs ? { [sortArgs]: order } : { updatedAt: -1 };
    const result =
      perPage > 0
        ? model
            .find(rest as any)
            .sort(sort)
            .skip(perPage * (page - 1))
            .limit(perPage)
        : model.find(rest as any).sort(sort);

    return {
      count,
      data: options.post
        ? options.post({ result: result as any, args: args as any, request: req, initialArgs, info })
        : result,
      perPage: perPage === -1 ? count : perPage,
      page,
      totalPages: Math.ceil(count / perPage),
    };
  }

  return apiWrapper(
    getList as any,
    listType(type),
    args as any,
    {
      ...options,
      validateSchema: options.validateSchema
        ? { ...listValidationSchema, ...options.validateSchema }
        : listValidationSchema,
      pre,
      post: undefined,
    } as any,
  );
}

export default list;
