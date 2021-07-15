import mongoose, { Schema, Model, Document, PopulatedDoc } from 'mongoose';
import { TagDocument } from './tag.model';
import { ThemeDocument } from './theme.model';

export interface Activity {
  title: string;
  description?: string;
  theme?: PopulatedDoc<ThemeDocument>;
  tag?: PopulatedDoc<TagDocument>;
  code?: string;
}

export interface ActivityDocument extends Document, Activity {}

export type ActivityModel = Model<ActivityDocument>;

const activitySchema = new Schema<ActivityDocument, ActivityModel>(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    code: { type: String, trim: true },
    theme: { type: Schema.Types.ObjectId, ref: 'Theme' },
    tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Activity', activitySchema);
