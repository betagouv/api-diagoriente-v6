import mongoose, { Schema, Model, Document } from 'mongoose';
import Activity, { ActivityDocument } from './activity.model';

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
  activities: Promise<ActivityDocument[]>;
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

themeSchema.virtual('activities').get(function (this: ThemeDocument) {
  return Activity.find({ theme: this.id });
});

export default mongoose.model('Theme', themeSchema);
