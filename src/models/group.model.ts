import mongoose, { Schema, Model, Document } from 'mongoose';

export interface Group {
  title: string;
  code: string;
  advisor: Schema.Types.ObjectId;
}

export interface GroupDocument extends Document, Group {}

export type GroupModel = Model<GroupDocument>;

const groupSchema = new Schema<GroupDocument, GroupModel>(
  {
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    advisor: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Group', groupSchema);
