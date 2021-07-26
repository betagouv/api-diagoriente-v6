import mongoose, { Schema, Model, Document, ObjectId } from 'mongoose';

export enum ActivityType {
  THEME = 'theme',
  TAG = 'tag',
}

export const activityTypes = [ActivityType.THEME, ActivityType.TAG];

export interface Activity {
  title: string;
  description?: string;
  type: ActivityType;
  typeId: ObjectId;
  code?: string;
}

export interface ActivityDocument extends Document, Activity {}

export type ActivityModel = Model<ActivityDocument>;

const activitySchema = new Schema<ActivityDocument, ActivityModel>(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    code: { type: String, trim: true },
    type: { type: String, required: true, enum: activityTypes },
    typeId: { type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Activity', activitySchema);
