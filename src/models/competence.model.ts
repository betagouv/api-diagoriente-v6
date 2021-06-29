import mongoose, { Schema, Model, Document } from 'mongoose';

export interface Competence {
  title: string;
  type: string;
  levels: { title: string; subTitle: string }[];
  reference: Schema.Types.ObjectId;
}

export interface CompetenceDocument extends Document, Competence {}

export type CompetenceModel = Model<CompetenceDocument>;

const competenceSchema = new Schema<CompetenceDocument, CompetenceModel>(
  {
    title: { type: String, required: true, max: 150 },
    type: { type: String, required: true },
    levels: [{ title: { type: String, max: 180 }, subTitle: { type: String, max: 180 } }],
    reference: { type: Schema.Types.ObjectId, required: true, ref: 'reference' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Competence', competenceSchema);
