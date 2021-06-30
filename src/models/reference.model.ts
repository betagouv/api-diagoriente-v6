import mongoose, { Schema, Model, Document } from 'mongoose';

export interface Reference {
  title: string;
  advisor: Schema.Types.ObjectId;
  public: boolean;
}

export interface ReferenceDocument extends Document, Reference {}

export type ReferenceModel = Model<ReferenceDocument>;

const referenceSchema = new Schema<ReferenceDocument, ReferenceModel>(
  {
    title: { type: String, required: true },
    advisor: { type: Schema.Types.ObjectId, ref: 'User' },
    public: { type: Boolean },
  },
  {
    timestamps: true,
  },
);

referenceSchema.virtual('competences', {
  ref: 'Competence',
  localField: '_id',
  foreignField: 'reference',
});

export default mongoose.model('Reference', referenceSchema);
