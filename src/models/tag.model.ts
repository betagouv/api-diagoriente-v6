import mongoose, { Schema, Model, Document } from 'mongoose';

import Theme from 'models/theme.model';

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

tagSchema.virtual('themes').get(function (this: TagDocument) {
  return Theme.find({ tag: this.id });
});

export default mongoose.model('Tag', tagSchema);
