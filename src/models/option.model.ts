import mongoose, { Schema, Model, Document } from 'mongoose';

export interface Option {
  title: string;
  parent: { path: Schema.Types.ObjectId[] }[];
  question: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  verified: boolean;
}

export interface OptionDocument extends Document, Option {}

export type OptionModel = Model<OptionDocument>;

const optionSchema = new Schema<OptionDocument, OptionModel>(
  {
    title: { type: String, required: true },
    parent: [{ path: [{ type: Schema.Types.ObjectId, ref: 'Option' }] }],
    question: { type: Schema.Types.ObjectId, required: true, ref: 'Question' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    verified: { type: Boolean },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Option', optionSchema);
