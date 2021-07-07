import mongoose, { Schema, Model, Document } from 'mongoose';

export interface Volunteer {
  user: Schema.Types.ObjectId;
  theme: Schema.Types.ObjectId;
  options: Schema.Types.ObjectId[][];
  startDate: Date;
  endDate: Date;
}

export interface VolunteerDocument extends Document, Volunteer {}

export type VolunteerModel = Model<VolunteerDocument>;

const volunteerSchema = new Schema<VolunteerDocument, VolunteerModel>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    theme: { type: Schema.Types.ObjectId, required: true, ref: 'Theme' },
    options: [[{ type: Schema.Types.ObjectId, ref: 'Option' }]],
    startDate: { type: Date },
    endDate: { type: Date },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Volunteer', volunteerSchema);
