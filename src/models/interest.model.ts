import mongoose, { Schema, Model, Document } from 'mongoose';

export interface Interest {
  title: string;
  cursors: { title: string }[][];
}

export interface InterestDocument extends Document, Interest {}

export type InterestModel = Model<InterestDocument>;

const interestSchema = new Schema<InterestDocument, InterestModel>(
  {
    title: { type: String, required: true, unique: true },
    cursors: [[{ title: { type: String, required: true } }]],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Interest', interestSchema);
