import mongoose, { Schema, Model, Document } from 'mongoose';

export interface Competence {
  title: string;
  type: string;
  niveau: { title: string; subTitle: string }[];
}

export interface CompetenceDocument extends Document, Competence {}

export type CompetenceModel = Model<CompetenceDocument>;

const competenceSchema = new Schema<CompetenceDocument, CompetenceModel>(
  {
    title: { type: String, required: true, maxLength: 150 },
    type: { type: String, required: true },
    niveau: [{ title: { type: String, maxLength: 180 }, subTitle: { type: String, maxLength: 180 } }],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Competence', competenceSchema);
