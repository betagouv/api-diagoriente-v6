import mongoose, { Schema, Model, Document, PopulatedDoc } from 'mongoose';
import { ReferenceDocument } from './reference.model';

export enum CompetenceType {
  ORGANIZATIONAL = 'organizational',
  COMMUNICATION = 'communication',
  REFLECTIVE = 'reflective',
}

export const competenceTypes = [CompetenceType.ORGANIZATIONAL, CompetenceType.COMMUNICATION, CompetenceType.REFLECTIVE];

export interface Competence {
  title: string;
  type: CompetenceType;
  levels: { title: string; subTitle: string }[];
  reference: PopulatedDoc<ReferenceDocument>;
  verified: boolean;
}

export interface CompetenceDocument extends Document, Competence {}

export type CompetenceModel = Model<CompetenceDocument>;

const competenceSchema = new Schema<CompetenceDocument, CompetenceModel>(
  {
    title: { type: String, required: true, max: 150 },
    type: { type: String, required: true, enum: competenceTypes },
    levels: [{ title: { type: String, max: 180 }, subTitle: { type: String, max: 180 } }],
    reference: { type: Schema.Types.ObjectId, required: true, ref: 'Reference' },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Competence', competenceSchema);
