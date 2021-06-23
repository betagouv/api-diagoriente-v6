import mongoose, { Schema, Model, Document } from 'mongoose';

export interface Tag {
  title: string;
  code: string;
  sector: Schema.Types.ObjectId;
}

export interface TagDocument extends Document, Tag {}

export type TagModel = Model<TagDocument>;

const tagSchema = new Schema<TagDocument, TagModel>(
  {
    title: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    sector: { type: Schema.Types.ObjectId, required: true, ref: 'Sector' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Tag', tagSchema);
