import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInputObjectType } from 'graphql';

export const CompetenceNiveauInputType = new GraphQLInputObjectType({
  name: 'CompetenceNiveauInput',
  fields: {
    title: { type: GraphQLString },
    subTitle: { type: GraphQLString },
  },
});

export const CompetenceNiveauType = new GraphQLObjectType({
  name: 'CompetenceNiveau',
  fields: {
    title: { type: GraphQLString },
    subTitle: { type: GraphQLString },
  },
});

export const CompetenceType = new GraphQLObjectType({
  name: 'Competence',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    type: { type: GraphQLString },
    niveau: { type: new GraphQLList(CompetenceNiveauType) },
  },
});
