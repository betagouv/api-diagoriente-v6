import mongoose, { Schema, Model, Document } from 'mongoose';

export interface Career {
  user: Schema.Types.ObjectId;
  advisor: Schema.Types.ObjectId;
  group: Schema.Types.ObjectId;
}

export interface CareerDocument extends Document, Career {}

export type CareerModel = Model<CareerDocument>;

const careerSchema = new Schema<CareerDocument, CareerModel>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    advisor: { type: Schema.Types.ObjectId, ref: 'User' },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Career', careerSchema);
