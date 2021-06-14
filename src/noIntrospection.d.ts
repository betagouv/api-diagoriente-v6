declare module 'graphql-disable-introspection' {
  import { ValidationContext, ASTVisitor } from 'graphql';

  export default (ctx: ValidationContext) => ASTVisitor;
}
