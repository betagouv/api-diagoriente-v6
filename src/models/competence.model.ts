import mongoose, { Schema, Model, Document, PopulatedDoc } from 'mongoose';
import { ReferenceDocument } from './reference.model';

export interface Competence {
  title: string;
  type: string;
  levels: { title: string; subTitle: string }[];
  reference: PopulatedDoc<ReferenceDocument>;
}

export interface CompetenceDocument extends Document, Competence {}

export type CompetenceModel = Model<CompetenceDocument>;

const competenceSchema = new Schema<CompetenceDocument, CompetenceModel>(
  {
    title: { type: String, required: true, max: 150 },
    type: { type: String, required: true },
    levels: [{ title: { type: String, max: 180 }, subTitle: { type: String, max: 180 } }],
    reference: { type: Schema.Types.ObjectId, required: true, ref: 'Reference' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Competence', competenceSchema);
