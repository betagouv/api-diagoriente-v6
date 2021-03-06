import mongoose, { Schema, Model, Document, PopulatedDoc } from 'mongoose';
import { ActivityDocument } from './activity.model';
import Level, { LevelDocument } from './level.model';
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
  activities: PopulatedDoc<ActivityDocument>[];
  reference: PopulatedDoc<ReferenceDocument>;
  scope: ThemeScope;
  level: number;
  levels: Promise<LevelDocument[]>;
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
    level: { type: Number, min: 2, max: 7 },
  },
  {
    timestamps: true,
  },
);

themeSchema.virtual('activities', {
  ref: 'Activity',
  localField: (doc: any) => {
    return doc.tag ? 'tag' : '_id';
  },
  foreignField: 'typeId',
});

themeSchema.virtual('levels').get(function (this: ThemeDocument) {
  if (!this.level) return [];
  return Level.find({ reference: this.reference, rank: { $gte: this.level - 1, $lte: this.level + 1 } });
});

export default mongoose.model('Theme', themeSchema);
