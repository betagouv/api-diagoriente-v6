import { GraphQLType, GraphQLError, GraphQLResolveInfo, SelectionSetNode, GraphQLList } from 'graphql';
import { Request } from 'express';
import { Document, Query } from 'mongoose';
import { isArray } from 'lodash';

import validate, { ISchemaObject } from 'middlewares/validation';

import { isUserAuthenticated } from 'utils/authHelpers';
import autoPopulate from 'utils/autoPopulate';

import { Role, UserDocument } from 'models/user.model';

type GraphQLToTS<T> = T extends GraphQLList<infer R> ? GraphQLToTS<R>[] : any;

export async function matchResult<T extends Record<any, any>>(
  result: T,
  info?: SelectionSetNode,
  populateCondition?: Record<string, any>,
): Promise<T> {
  if (typeof result !== 'object' || !info || isArray(result)) return result;

  if (result instanceof Document) {
    return await result.populate(autoPopulate(result.schema, info, populateCondition)).execPopulate();
  }

  if (result instanceof Query) {
    return await result.populate(autoPopulate((result as any).schema, info, populateCondition));
  }

  const newResult = {} as T;
  const keys: (keyof T)[] = Object.keys(result) as any;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const nextSelection = info.selections.find(
      (selection) => selection.kind === 'Field' && selection.name.value === key,
    );

    newResult[key] =
      nextSelection && nextSelection.kind === 'Field'
        ? await matchResult(result[key], nextSelection.selectionSet, populateCondition)
        : result[key];
  }
  return newResult;
}

export interface LocalRequest extends Omit<Request, 'user'> {
  user: UserDocument | undefined;
}

export interface Options<T, A extends { [key: string]: { type: GraphQLType } }, C = any> {
  authorizationRoles?: Role[];
  validateSchema?: ISchemaObject;
  post?: (p: {
    result: T;
    args: C;
    request: LocalRequest;
    info: GraphQLResolveInfo;
    initialArgs: { [K in keyof A]: GraphQLToTS<A[K]['type']> };
  }) => any;
  pre?: (args: { [K in keyof A]: GraphQLToTS<A[K]['type']> }, request: LocalRequest) => Promise<C> | C;
  autoPopulate?: boolean;
  populateConditions?: (p: {
    result: T;
    args: C;
    initialArgs: { [K in keyof A]: GraphQLToTS<A[K]['type']> };
    request: LocalRequest;
    info: GraphQLResolveInfo;
  }) => Record<string, any>;
}

export interface IApiWrapperReturn<A extends { [key: string]: { type: GraphQLType } }, R = Record<string, any>> {
  type: GraphQLType;
  args: A;
  resolve(parent: any, args: { [K in keyof A]: any }, req: LocalRequest, info: GraphQLResolveInfo): Promise<R>;
}

export function apiWrapper<T, A extends { [key: string]: { type: GraphQLType } }, C, R = any>(
  callback: (
    args: { [K in keyof A]: any | C },
    req: LocalRequest,
    info: GraphQLResolveInfo,
    parent?: any,
  ) => Promise<T> | T,
  type: GraphQLType,
  args: A,
  options: Options<T, A, C> = {},
): IApiWrapperReturn<A, R> {
  return {
    type,
    args,
    async resolve(parent: any, initialArgs: { [K in keyof A]: any }, req: LocalRequest, info: GraphQLResolveInfo) {
      const authorizationRoles = options.authorizationRoles || [];
      if (!isUserAuthenticated(req, authorizationRoles)) throw new GraphQLError('Accès non autorisé');
      if (options.validateSchema) {
        validate(options.validateSchema, initialArgs);
      }

      const args = (options.pre && (await options.pre(initialArgs, req))) as C;
      const handledArgs = args || initialArgs;
      let result = await callback(handledArgs as any, req, info, parent || undefined);

      if (options.post) {
        result = await options.post({ result, args, initialArgs, request: req, info });
      }

      if (options.autoPopulate !== false) {
        result = await matchResult(
          result,
          info.fieldNodes[0].selectionSet,
          options.populateConditions
            ? options.populateConditions({ result, args, initialArgs, request: req, info })
            : undefined,
        );
      }

      return result as any;
    },
  };
}

export default apiWrapper;
