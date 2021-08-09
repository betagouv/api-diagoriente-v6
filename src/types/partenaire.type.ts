import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
} from 'graphql';

export const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    address: { type: GraphQLString },
    alternance: { type: GraphQLBoolean },
    boosted: { type: GraphQLBoolean },
    city: { type: GraphQLString },
    contact_mode: { type: GraphQLString },
    distance: { type: GraphQLFloat },
    headcount_text: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lon: { type: GraphQLFloat },
    matched_rome_code: { type: GraphQLString },
    matched_rome_label: { type: GraphQLString },
    matched_rome_slug: { type: GraphQLString },
    naf: { type: GraphQLString },
    naf_text: { type: GraphQLString },
    name: { type: GraphQLString },
    pmsmp: { type: GraphQLString },
    siret: { type: GraphQLString },
    social_network: { type: GraphQLString },
    stars: { type: GraphQLFloat },
    url: { type: GraphQLString },
    website: { type: GraphQLString },
  }),
});

export const ImmersionType = new GraphQLObjectType({
  name: 'Immersion',
  fields: () => ({
    companies: { type: new GraphQLList(CompanyType) },
    companies_count: { type: GraphQLInt },
    rome_code: { type: GraphQLString },
    rome_label: { type: GraphQLString },
    url: { type: GraphQLString },
  }),
});

const FormationAddressType = new GraphQLObjectType({
  name: 'FormationAddress',
  fields: () => ({
    id: { type: GraphQLID },
    address: { type: GraphQLString },
    fullAddress: { type: GraphQLString },
    postalCode: { type: GraphQLString },
    country: { type: GraphQLString },
    city: { type: GraphQLString },
    zipCode: { type: GraphQLString },
    latitude: { type: GraphQLFloat },
    longitude: { type: GraphQLFloat },
  }),
});

const FormationContactType = new GraphQLObjectType({
  name: 'FormationContact',
  fields: () => ({
    email: { type: GraphQLString },
  }),
});

const FormationHeadquarterType = new GraphQLObjectType({
  name: 'FormationHeadquarter',
  fields: () => ({
    place: { type: FormationCompanyInfoType },
  }),
});
const FormationCompanyInfoType = new GraphQLObjectType({
  name: 'FormationCompanyInfo',
  fields: () => ({
    address: { type: GraphQLString },
    city: { type: GraphQLString },
    zipCode: { type: GraphQLString },
  }),
});

const FormationCompanyType = new GraphQLObjectType({
  name: 'FormationCompany',
  fields: () => ({
    name: { type: GraphQLString },
    siret: { type: GraphQLString },
    headquarter: { type: FormationHeadquarterType },
  }),
});

export const FormationType = new GraphQLObjectType({
  name: 'Formation',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    longTitle: { type: GraphQLString },
    place: { type: FormationAddressType },
    contact: { type: FormationContactType },
    company: { type: FormationCompanyType },
    diplomaLevel: { type: GraphQLString },
    ideaType: { type: GraphQLString },
  }),
});

const FormationLabelAndRomesType = new GraphQLObjectType({
  name: 'FormationLabelAndRomes',
  fields: () => ({
    label: { type: GraphQLString },
    romes: { type: new GraphQLList(GraphQLString) },
  }),
});

export const FormationLabelType = new GraphQLObjectType({
  name: 'FormationLabel',
  fields: () => ({
    labelsAndRomes: { type: new GraphQLList(FormationLabelAndRomesType) },
  }),
});

export const MissionModerationType = new GraphQLObjectType({
  name: 'MissionModeration',
  fields: {
    statusCode: { type: GraphQLString },
    _id: { type: GraphQLString },
    publisher: { type: GraphQLString },
    publisherName: { type: GraphQLString },
    publisherLogo: { type: GraphQLString },
    statusComment: { type: GraphQLString },
    author: { type: GraphQLString },
  },
});

export const MissionLocationType = new GraphQLObjectType({
  name: 'MissionLocation',
  fields: {
    lat: { type: GraphQLFloat },
    lon: { type: GraphQLFloat },
  },
});

export const MissionType = new GraphQLObjectType({
  name: 'Mission',
  fields: {
    location: { type: MissionLocationType },
    tasks: { type: GraphQLList(GraphQLString) },
    audience: { type: GraphQLList(GraphQLString) },
    soft_skills: { type: GraphQLList(GraphQLString) },
    remote: { type: GraphQLString },
    _id: { type: GraphQLString },
    clientId: { type: GraphQLString },
    publisherId: { type: GraphQLString },
    activity: { type: GraphQLString },
    adresse: { type: GraphQLString },
    applicationUrl: { type: GraphQLString },
    city: { type: GraphQLString },
    country: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    departmentCode: { type: GraphQLString },
    departmentName: { type: GraphQLString },
    description: { type: GraphQLString },
    domain: { type: GraphQLString },
    endAt: { type: GraphQLString },
    lastSyncAt: { type: GraphQLString },
    organizationFullAddress: { type: GraphQLString },
    organizationId: { type: GraphQLString },
    organizationName: { type: GraphQLString },
    organizationUrl: { type: GraphQLString },
    places: { type: GraphQLInt },
    postalCode: { type: GraphQLString },
    postedAt: { type: GraphQLString },
    publisherLogo: { type: GraphQLString },
    publisherName: { type: GraphQLString },
    publisherUrl: { type: GraphQLString },
    startAt: { type: GraphQLString },
    title: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    region: { type: GraphQLString },
    jobboard_indeed_status: { type: GraphQLString },
    deleted: { type: GraphQLString },
    priority: { type: GraphQLString },
    organizationDescription: { type: GraphQLString },
    statusCode: { type: GraphQLString },
    statusComment: { type: GraphQLString },
    moderation: { type: GraphQLList(MissionModerationType) },
  },
});

export const MissionListType = new GraphQLObjectType({
  name: 'MissionList',
  fields: {
    total: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    skip: { type: GraphQLInt },
    data: { type: new GraphQLList(MissionType) },
  },
});
