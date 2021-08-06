import mongoose, { Schema, Model, Document, PopulatedDoc } from 'mongoose';
import { themeDomains, ThemeDomain, ThemeDocument } from 'models/theme.model';
import Level, { LevelDocument } from './level.model';
import Competence, { CompetenceDocument } from './competence.model';
import { ActivityDocument } from './activity.model';
import { UserDocument } from './user.model';
export interface Skill {
  user: PopulatedDoc<UserDocument>;
  theme: PopulatedDoc<ThemeDocument>;
  activities: PopulatedDoc<ActivityDocument>[];
  extraActivity: string;
  levels: PopulatedDoc<LevelDocument>[];
  competences: PopulatedDoc<CompetenceDocument>[];
  domain: ThemeDomain;
}

export interface SkillDocument extends Document, Skill {}

export type SkillModel = Model<SkillDocument>;

const skillSchema = new Schema<SkillDocument, SkillModel>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    theme: { type: Schema.Types.ObjectId, required: true, ref: 'Theme' },
    activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    competences: [{ type: Schema.Types.ObjectId, required: true, ref: 'Competence' }],
    levels: [{ type: Schema.Types.ObjectId, required: true, ref: 'Level' }],
    domain: { type: String, enum: themeDomains, required: true },
    extraActivity: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  {
    timestamps: true,
  },
);

skillSchema.virtual('ranks').get(async function (this: SkillDocument) {
  const levels = await Level.find({ _id: { $in: this.levels } });
  const competences = await Competence.find({ _id: { $in: this.competences } });
  return competences.map((competence) => {
    const level = levels.find((l) => l.competenceTypes.find((type) => competence.type === type));
    return {
      competence,
      level,
      rank: level?.rank || 0,
    };
  });
});

skillSchema.virtual('recommendations', {
  ref: 'Recommendation',
  localField: '_id',
  foreignField: 'skill',
});

export default mongoose.model('Skill', skillSchema);
