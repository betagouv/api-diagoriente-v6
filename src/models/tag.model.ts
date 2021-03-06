import mongoose, { Schema, Model, Document, PopulatedDoc } from 'mongoose';
import { SectorDocument } from './sector.model';

export interface Tag {
  title: string;
  code: string;
  sector: PopulatedDoc<SectorDocument>;
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

tagSchema.virtual('themes', {
  ref: 'Theme',
  localField: '_id',
  foreignField: 'tag',
});

export default mongoose.model('Tag', tagSchema);
