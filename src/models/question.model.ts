import mongoose, { Schema, Model, Document } from 'mongoose';

export interface Question {
  title: string;
  parent: Schema.Types.ObjectId;
}

export interface QuestionDocument extends Document, Question {}

export type QuestionModel = Model<QuestionDocument>;

const questionSchema = new Schema<QuestionDocument, QuestionModel>(
  {
    title: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Question' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Question', questionSchema);
