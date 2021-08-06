import mongoose, { Schema, Model, Document } from 'mongoose';
import { hash } from 'bcryptjs';

export enum RecommendationStatus {
  ACCEPTED = 'accepted',
  REFUSED = 'refused',
  PENDING = 'pending',
}

export const recommendationStatus = [
  RecommendationStatus.ACCEPTED,
  RecommendationStatus.REFUSED,
  RecommendationStatus.PENDING,
];

export interface Recommendation {
  skill: Schema.Types.ObjectId;
  status: RecommendationStatus;
  email: string;
  secret: string;
  firstName: string;
  lastName: string;
  message: string;
  response: string;
}

export interface RecommendationDocument extends Document, Recommendation {}

export type RecommendationModel = Model<RecommendationDocument>;

const recommendationSchema = new Schema<RecommendationDocument, RecommendationModel>(
  {
    skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    status: { type: String, enum: recommendationStatus },
    secret: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    message: { type: String, required: true },
    response: { type: String },
  },
  {
    timestamps: true,
  },
);

recommendationSchema.pre('save', async function (next) {
  try {
    this.secret = await hash(this.secret, 10);
    next();
  } catch (e) {
    return next(e);
  }
});

export default mongoose.model('Recommendation', recommendationSchema);
