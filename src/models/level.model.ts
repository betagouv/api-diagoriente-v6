import mongoose, { Schema, Model, Document } from 'mongoose';
import { CompetenceType, competenceTypes } from './competence.model';

export enum LevelType {
  RESPONSIBILITY = 'responsibility',
  COMPLEXITY = 'complexity',
  ENVIRONMENT = 'environment',
}

export const levelTypes = [LevelType.RESPONSIBILITY, LevelType.COMPLEXITY, LevelType.ENVIRONMENT];
export interface Level {
  title: string;
  rank: number;
  reference: Schema.Types.ObjectId;
  type: LevelType;
  competenceTypes: CompetenceType[];
}

export interface LevelDocument extends Document, Level {}

export type LevelModel = Model<LevelDocument>;

const levelSchema = new Schema<LevelDocument, LevelModel>(
  {
    title: { type: String, required: true, unique: true },
    rank: { type: Number, required: true, min: 1, max: 8 },
    reference: { type: Schema.Types.ObjectId, required: true, ref: 'Reference' },
    competenceTypes: [{ type: String, enum: competenceTypes }],
    type: { type: String, required: true, enum: levelTypes },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Level', levelSchema);
