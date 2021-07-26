import mongoose, { Schema, Model, Document } from 'mongoose';
import { groupBy } from 'lodash';
import Cursor, { CursorDocument } from './cursor.model';
export interface Interest {
  title: string;
  cursors: Promise<CursorDocument[][]>;
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

interestSchema.virtual('cursors').get(async function (this: InterestDocument) {
  const cursors = await Cursor.find({ interest: this._id });
  const groupedCursors = groupBy(cursors, (c) => c.index);
  const result = [];
  for (let i = 0; i < 5; i += 1) {
    result.push(groupedCursors[i]);
  }
  return result;
});

export default mongoose.model('Interest', interestSchema);
