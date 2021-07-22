import mongoose, { Schema, Model, Document, PopulatedDoc } from 'mongoose';
import { themeDomains, ThemeDomain, ThemeDocument } from 'models/theme.model';
import { LevelDocument } from './level.model';
import { ActivityDocument } from './activity.model';
import { UserDocument } from './user.model';
import { CompetenceDocument } from './competence.model';
export interface Skill {
  user: PopulatedDoc<UserDocument>;
  theme: PopulatedDoc<ThemeDocument>;
  activities: PopulatedDoc<ActivityDocument>[];
  extraActivity: string;
  level: PopulatedDoc<LevelDocument>;
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

export default mongoose.model('Skill', skillSchema);
