import joi from 'joi';
import { GraphQLID, GraphQLList, GraphQLError, GraphQLString } from 'graphql';
import moment from 'moment';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Skill from 'models/skill.model';
import Theme, { ThemeDocument, ThemeScope } from 'models/theme.model';
import Competence from 'models/competence.model';

import { SkillType } from 'types/skill.type';

async function validateSkillData(
  args: {
    activities: string[];
    competences: { competence: string; value: number }[];
    startDate: string;
    endDate: string;
    level: string;
  },
  theme: ThemeDocument,
) {
  const activities = await theme.activities;
  const levels = await theme.levels;
  if (args.activities.find((activity) => activities.find((act) => activity === act.id.toString())))
    throw new GraphQLError('Une ou plusieurs activités invalides');
  const competences = await Competence.find({
    reference: theme.reference,
    _id: { $in: args.competences },
  });

  if (!levels.find((l) => l.id.toString() === args.level)) throw new GraphQLError('Niveau invalide');

  if (competences.length !== args.competences.length) throw new GraphQLError('Une ou plusieurs compétences invalides');

  if (args.endDate && !args.startDate) throw new GraphQLError('Date de début invalide');

  if (args.startDate && args.endDate && moment(args.endDate).isBefore(args.startDate))
    throw new GraphQLError('La date de début doit être antérieure à la date de fin');
}

const createSkillValidation = {
  theme: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  activities: joi
    .array()
    .items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .required(),
  competences: joi
    .array()
    .items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .unique()
    .required(),
  level: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  startDate: joi.string().isoDate(),
  endDate: joi.string().isoDate(),
  extraActivity: joi.string(),
};

const updateSkillValidation = {
  activities: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  competences: joi
    .array()
    .items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .unique(),
  level: joi.string().regex(/^[0-9a-fA-F]{24}$/),
  startDate: joi.string().isoDate(),
  endDate: joi.string().isoDate(),
  extraActivity: joi.string(),
};

export default {
  createSkill: create(
    Skill,
    {
      theme: { type: GraphQLID, required: true },
      activities: { type: new GraphQLList(GraphQLID), required: true },
      competences: { type: new GraphQLList(GraphQLID), required: true },
      level: { type: GraphQLID, required: true },
      extraActivity: { type: GraphQLString, required: false },
      startDate: { type: GraphQLString, required: false },
      endDate: { type: GraphQLString, required: false },
    },
    SkillType,
    {
      validateSchema: createSkillValidation,
      authorizationRoles: [Role.USER],
      pre: async (args, req) => {
        const { user } = req;
        const theme = await Theme.findOne({
          _id: args.theme,
          $or: [{ scope: ThemeScope.SKILL }, { scope: { $exists: false } }],
        }).populate('activities');
        if (!theme) throw new GraphQLError('Theme introuvable');
        await validateSkillData(args, theme);

        return { ...args, domain: theme.domain, user: user?.id };
      },
    },
  ),
  updateSkill: update(
    Skill,
    {
      activities: new GraphQLList(GraphQLID),
      competences: new GraphQLList(GraphQLID),
      extraActivity: GraphQLString,
      level: GraphQLID,
      startDate: GraphQLString,
      endDate: GraphQLString,
    },
    SkillType,
    {
      validateSchema: updateSkillValidation,
      authorizationRoles: [Role.USER],
      pre: async (args, req) => {
        const { user } = req;
        const skill = await Skill.findOne({ _id: args.id, user: user?.id });
        if (!skill) throw new GraphQLError('Experience introuvable');
        const theme = await Theme.findOne({ _id: skill.theme }).populate('activities');
        if (!theme) throw new GraphQLError('Theme introuvable');
        await validateSkillData(args, theme);

        return args;
      },
    },
  ),
  removeSkill: remove(Skill, {
    authorizationRoles: [Role.USER],
    pre: (args, req) => {
      return { ...args, user: req.user?.id };
    },
  }),
};
