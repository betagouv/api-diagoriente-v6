import mongoose, { Schema, Model, Document, PopulatedDoc } from 'mongoose';
import { ThemeDocument } from './theme.model';

export interface Activity {
  title: string;
  description: string;
  theme: PopulatedDoc<ThemeDocument>;
}

export interface ActivityDocument extends Document, Activity {}

export type ActivityModel = Model<ActivityDocument>;

const activitySchema = new Schema<ActivityDocument, ActivityModel>(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    theme: { type: Schema.Types.ObjectId, required: true, ref: 'Theme' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Activity', activitySchema);
