import mongoose, { Schema, Model, Document } from 'mongoose';

export interface Level {
  title: string;
  rank: number;
  reference: Schema.Types.ObjectId;
}

export interface LevelDocument extends Document, Level {}

export type LevelModel = Model<LevelDocument>;

const levelSchema = new Schema<LevelDocument, LevelModel>(
  {
    title: { type: String, required: true, unique: true },
    rank: { type: Number, required: true, min: 1, max: 8 },
    reference: { type: Schema.Types.ObjectId, required: true, ref: 'Reference' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Level', levelSchema);
