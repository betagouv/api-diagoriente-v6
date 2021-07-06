import mongoose, { Schema, Model, Document, PopulatedDoc } from 'mongoose';
import { ActivityDocument } from './activity.model';
import { ReferenceDocument } from './reference.model';

export enum ThemeDomain {
  PERSONAL = 'personal',
  PROFESSIONAL = 'professional',
  VOLUNTARY = 'voluntary',
}

export const themeDomains = [ThemeDomain.PERSONAL, ThemeDomain.PROFESSIONAL, ThemeDomain.VOLUNTARY];

export interface Theme {
  title: string;
  domain: string;
  code: string;
  tag: Schema.Types.ObjectId;
  activities?: ActivityDocument[];
  reference: PopulatedDoc<ReferenceDocument>;
}

export interface ThemeDocument extends Document, Theme {}

export type ThemeModel = Model<ThemeDocument>;

const themeSchema = new Schema<ThemeDocument, ThemeModel>(
  {
    title: { type: String, required: true, unique: true },
    domain: { type: String, enum: themeDomains, required: true },
    code: { type: String, unique: true },
    tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
    image: { type: String },
    reference: { type: Schema.Types.ObjectId, ref: 'Reference', required: true },
  },
  {
    timestamps: true,
  },
);

themeSchema.virtual('activities', {
  ref: 'Activity',
  localField: '_id',
  foreignField: 'theme',
});

export default mongoose.model('Theme', themeSchema);
