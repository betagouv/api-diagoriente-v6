import mongoose, { Schema, Model, Document, PopulatedDoc } from 'mongoose';
import Activity, { ActivityDocument } from './activity.model';
import { ReferenceDocument } from './reference.model';
import { TagDocument } from './tag.model';

export enum ThemeScope {
  SKILL = 'skill',
  VOLUNTEER = 'volunteer',
}

export const themeScopes = [ThemeScope.SKILL, ThemeScope.VOLUNTEER];

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
  tag: PopulatedDoc<TagDocument>;
  image: string;
  activities?: ActivityDocument[];
  reference: PopulatedDoc<ReferenceDocument>;
  scope: ThemeScope;
  level: number;
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
    scope: { type: String, enum: ThemeScope, default: ThemeScope.SKILL },
    level: { type: Number },
  },
  {
    timestamps: true,
  },
);

themeSchema.virtual('activities').get(function (this: ThemeDocument) {
  return Activity.find({ $or: [{ theme: this._id }, { tag: this.tag }] });
});

export default mongoose.model('Theme', themeSchema);
