import mongoose, { Schema, Model, Document } from 'mongoose';
import { themeDomains } from 'models/theme.model';
export interface Skill {
  user: Schema.Types.ObjectId;
  theme: Schema.Types.ObjectId;
  activities: Schema.Types.ObjectId[];
  competences: { competence: Schema.Types.ObjectId; value: number; extraActivity: string }[];
}

export interface SkillDocument extends Document, Skill {}

export type SkillModel = Model<SkillDocument>;

const skillSchema = new Schema<SkillDocument, SkillModel>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    theme: { type: Schema.Types.ObjectId, required: true, ref: 'Theme' },
    activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    competences: [
      {
        competence: { type: Schema.Types.ObjectId, required: true, ref: 'Competence' },
        value: { type: Number, required: true, min: 1, max: 8 },
      },
    ],
    domaine: { type: String, enum: themeDomains, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Skill', skillSchema);
