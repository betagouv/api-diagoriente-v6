import mongoose, { Schema, Model, Document, Types } from 'mongoose';

export interface Interest {
  title: string;
  cursors: { _id: Types.ObjectId; title: string }[][];
}

export interface InterestDocument extends Document, Interest {}

export type InterestModel = Model<InterestDocument>;

const interestSchema = new Schema<InterestDocument, InterestModel>(
  {
    title: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

interestSchema.virtual('cursors', {
  ref: 'Cursor',
  localField: '_id',
  foreignField: 'interest',
});

export default mongoose.model('Interest', interestSchema);
