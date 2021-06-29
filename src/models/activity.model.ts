import mongoose, { Schema, Model, Document } from 'mongoose';

export interface Activity {
  title: string;
  description: string;
  theme: Schema.Types.ObjectId;
}

export interface ActivityDocument extends Document, Activity {}

export type ActivityModel = Model<ActivityDocument>;

const activitySchema = new Schema<ActivityDocument, ActivityModel>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    theme: { type: Schema.Types.ObjectId, required: true, ref: 'theme' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Activity', activitySchema);
