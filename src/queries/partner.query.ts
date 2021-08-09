import { GraphQLNonNull, GraphQLString, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLID } from 'graphql';
import axios from 'axios';
import apiWrapper from 'crud/apiWrapper';

import { ImmersionType, FormationType, FormationLabelType, MissionListType } from 'types/partenaire.type';
import generateToken from 'utils/generateToken';
import { Role } from 'models/user.model';

export default {
  immersions: apiWrapper(
    async (args) => {
      const token = await generateToken();
      const result = await axios.get('https://api.emploi-store.fr/partenaire/labonneboite/v1/company', {
        params: { flag_pmsmp: 1, ...args },
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      return result.data;
    },
    ImmersionType,
    {
      headcount: { type: GraphQLString },
      sort: { type: GraphQLString },
      rome_codes: { type: GraphQLNonNull(GraphQLString) },
      latitude: { type: GraphQLNonNull(GraphQLFloat) },
      longitude: { type: GraphQLNonNull(GraphQLFloat) },
      distance: { type: GraphQLInt },
      page_size: { type: GraphQLInt },
      page: { type: GraphQLInt },
    },
    {
      authorizationRoles: [Role.USER],
    },
  ),
  formation: apiWrapper(
    async (args) => {
      const validInsee = args.insee.toString().length === 4 ? `0${args.insee}` : args.insee;
      const params = {
        ...args,
        romes: JSON.parse(args.romes).toString(),
        insee: validInsee,
      };

      let resultJob: any = [];
      const [resjobs, resFormation] = await Promise.all([
        axios.get(`https://labonnealternance.apprentissage.beta.gouv.fr/api/v1/jobs`, {
          params,
        }),
        axios.get(`https://labonnealternance.apprentissage.beta.gouv.fr/api/v1/formations`, {
          params,
        }),
      ]);
      if (resFormation) {
        if (resFormation.data.results !== 0) {
          resultJob.push(...resFormation.data.results);
        }
      }
      if (resjobs.data) {
        if (resjobs.data.peJobs.results !== 0) {
          resultJob.push(...resjobs.data.peJobs.results);
        }
        if (resjobs.data.lbaCompanies.results.length !== 0) {
          resultJob.push(...resjobs.data.lbaCompanies.results);
        }
        if (resjobs.data.lbbCompanies.results.length !== 0) {
          resultJob.push(...resjobs.data.lbbCompanies.results);
        }
      }
      let formattedData = [];
      if (args.filter !== 'Tout') {
        if (args.filter === 'Formations') {
          formattedData = resultJob.filter((f: any) => f.ideaType === 'formation');
          resultJob = formattedData;
        } else {
          formattedData = resultJob.filter((f: any) => f.ideaType !== 'formation');
          resultJob = formattedData;
        }
      }

      return resultJob;
    },
    GraphQLList(FormationType),
    {
      romes: { type: GraphQLString },
      latitude: { type: GraphQLNonNull(GraphQLFloat) },
      longitude: { type: GraphQLNonNull(GraphQLFloat) },
      radius: { type: GraphQLNonNull(GraphQLInt) },
      diploma: { type: GraphQLString },
      insee: { type: GraphQLID },
      caller: { type: GraphQLNonNull(GraphQLString) },
      filter: { type: GraphQLString },
    },
    { authorizationRoles: [Role.USER] },
  ),
  formationLabel: apiWrapper(
    async (args) => {
      const res = await axios.get(
        `https://labonnealternance.apprentissage.beta.gouv.fr/api/romelabels?title=${args.search}`,
      );

      res.data.labelsAndRomes = res.data.labelsAndRomes.filter((item: any) => Boolean(item.label));
      return res.data;
    },
    FormationLabelType,
    {
      search: { type: GraphQLNonNull(GraphQLString) },
    },
    { authorizationRoles: [Role.USER] },
  ),
  missions: apiWrapper(
    async (args) => {
      const res = await axios.get('https://api.api-engagement.beta.gouv.fr/v0/mission', {
        headers: { apiKey: '59d84cba_8043_48cf_8d5a_650014d5e1d5' },
        params: args,
      });
      return res.data;
    },
    MissionListType,
    {
      departmentName: { type: GraphQLString },
      country: { type: GraphQLString },
      activity: { type: GraphQLString },
      city: { type: GraphQLString },
      publisher: { type: GraphQLString },
      domain: { type: GraphQLString },
      type: { type: GraphQLString },
      skip: { type: GraphQLString },
      limit: { type: GraphQLString },
    },
  ),
};
