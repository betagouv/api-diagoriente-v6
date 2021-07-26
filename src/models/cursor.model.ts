import mongoose, { Schema, Model, Document } from 'mongoose';

export interface Cursor {
  title: string;
  interest: string;
  index: number;
}

export interface CursorDocument extends Document, Cursor {}

export type CursorModel = Model<CursorDocument>;

const cursorSchema = new Schema<CursorDocument, CursorModel>(
  {
    title: { type: String, required: true },
    interest: { type: Schema.Types.ObjectId, ref: 'Interest', required: true },
    index: { type: Number, required: true, min: 0, max: 4 },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Cursor', cursorSchema);
