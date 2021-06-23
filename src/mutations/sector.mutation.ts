import joi from 'joi';
import { GraphQLString } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Sector from 'models/sector.model';

import { SectorType } from 'types/sector.type';

const createSectorValidation = {
  title: joi.string().required(),
  code: joi.string().required(),
};

const updateSectorValidation = {
  title: joi.string(),
  code: joi.string(),
};

export default {
  createSector: create(
    Sector,
    { title: { type: GraphQLString, required: true }, code: { type: GraphQLString, required: true } },
    SectorType,
    { validateSchema: createSectorValidation, authorizationRoles: [Role.ADMIN] },
  ),
  updateSector: update(Sector, { title: GraphQLString, code: GraphQLString }, SectorType, {
    validateSchema: updateSectorValidation,
    authorizationRoles: [Role.ADMIN],
  }),
  removeSector: remove(Sector, { authorizationRoles: [Role.ADMIN] }),
};
