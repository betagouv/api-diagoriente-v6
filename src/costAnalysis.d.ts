declare module 'graphql-cost-analysis' {
  import { ValidationContext, ASTVisitor } from 'graphql';

  export default (args: { maximumCost: number }) => (ctx: ValidationContext) => ASTVisitor;
}
