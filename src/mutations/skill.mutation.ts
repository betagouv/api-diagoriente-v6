import joi from 'joi';
import { GraphQLID, GraphQLList, GraphQLError } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Skill from 'models/skill.model';
import Career from 'models/career.model';
import Theme from 'models/theme.model';
import Competence from 'models/competence.model';

import { SkillType, SkillCompetencesInputType } from 'types/skill.type';

const createSkillValidation = {
  career: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
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
    .items(
      joi
        .object({
          competence: joi
            .string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
          value: joi.number().min(1).max(8).required(),
        })
        .required(),
    )
    .unique((a, b) => a.competence === b.competence)
    .required(),
};

const updateSkillValidation = {
  career: joi.string().regex(/^[0-9a-fA-F]{24}$/),
  theme: joi.string().regex(/^[0-9a-fA-F]{24}$/),
  activities: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  competences: joi
    .array()
    .items(
      joi.object({
        competence: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        value: joi.number().min(1).max(8).required(),
      }),
    )
    .unique((a, b) => a.competence === b.competence),
};

export default {
  createSkill: create(
    Skill,
    {
      career: { type: GraphQLID, required: true },
      theme: { type: GraphQLID, required: true },
      activities: { type: new GraphQLList(GraphQLID), required: true },
      competences: { type: new GraphQLList(SkillCompetencesInputType), required: true },
    },
    SkillType,
    {
      validateSchema: createSkillValidation,
      authorizationRoles: [Role.USER],
      pre: async (args, req) => {
        const { user } = req;
        const career = await Career.findOne({ _id: args.career, user: user?.id });
        if (!career) throw new GraphQLError('Parcour introuvable');
        const theme = await Theme.findOne({ _id: args.theme }).populate('activities');
        if (!theme) throw new GraphQLError('Theme introuvable');
        if (args.activities.find((activity) => !theme.activities?.find((act) => activity === act.id.toString())))
          throw new GraphQLError('Une ou plusieurs activités invalides');
        const competences = await Competence.find({
          reference: theme.reference,
          _id: { $in: args.competences.map((c: any) => c.competence) },
        });

        if (competences.length !== args.competences.length)
          throw new GraphQLError('Une ou plusieurs compétences invalides');

        return args;
      },
    },
  ),
  updateSkill: update(
    Skill,
    {
      activities: new GraphQLList(GraphQLID),
      competences: new GraphQLList(SkillCompetencesInputType),
    },
    SkillType,
    {
      validateSchema: updateSkillValidation,
      authorizationRoles: [Role.USER],
      pre: async (args, req) => {
        const { user } = req;
        const careers: any[] = await (user ? user.carriers : []);
        const skill = await Skill.findOne({ _id: args.id, career: { $in: careers } });
        if (!skill) throw new GraphQLError('Experience introuvable');
        const theme = await Theme.findOne({ _id: skill.theme }).populate('activities');
        if (!theme) throw new GraphQLError('Theme introuvable');
        if (
          args.activities &&
          args.activities.find((activity) => !theme.activities?.find((act) => activity === act.id.toString()))
        )
          throw new GraphQLError('Une ou plusieurs activités invalides');
        if (args.competences && args.competences.length) {
          const competences = await Competence.find({
            reference: theme.reference,
            _id: { $in: args.competences.map((c: any) => c.competence) },
          });

          if (competences.length !== args.competences.length)
            throw new GraphQLError('Une ou plusieurs compétences invalides');
        }

        return args;
      },
    },
  ),
  removeSkill: remove(Skill, { authorizationRoles: [Role.ADMIN] }),
};
