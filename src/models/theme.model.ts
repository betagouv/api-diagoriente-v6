import mongoose, { Schema, Model, Document } from 'mongoose';

export enum ThemeDomain {
  PERSONAL = 'personal',
  PROFESSIONAL = 'professional',
}

export const themeDomains = [ThemeDomain.PERSONAL, ThemeDomain.PROFESSIONAL];

export interface Theme {
  title: string;
  domain: string;
  code: string;
  tag: Schema.Types.ObjectId;
}

export interface ThemeDocument extends Document, Theme {}

export type ThemeModel = Model<ThemeDocument>;

const themeSchema = new Schema<ThemeDocument, ThemeModel>(
  {
    title: { type: String, required: true, unique: true },
    domain: { type: String, enum: themeDomains, required: true },
    code: { type: String, required: true, unique: true },
    tag: { type: Schema.Types.ObjectId, required: true, ref: 'Tag' },
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
