import mongoose, { Schema, Model, Document } from 'mongoose';

import Competence, { CompetenceDocument } from './competence.model';

export interface Reference {
  title: string;
  advisor: Schema.Types.ObjectId;
  public: boolean;
  competences: Promise<CompetenceDocument[]>;
}

export interface ReferenceDocument extends Document, Reference {}

export type ReferenceModel = Model<ReferenceDocument>;

const referenceSchema = new Schema<ReferenceDocument, ReferenceModel>(
  {
    title: { type: String, required: true },
    advisor: { type: Schema.Types.ObjectId, ref: 'user' },
    public: { type: Boolean },
  },
  {
    timestamps: true,
  },
);

referenceSchema.virtual('competences').get(async function (this: ReferenceDocument) {
  return Competence.find({ reference: this._id });
});

export default mongoose.model('Reference', referenceSchema);
