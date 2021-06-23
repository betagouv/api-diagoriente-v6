import mongoose, { Schema, Model, Document } from 'mongoose';

export interface Sector {
  title: string;
  code: string;
}

export interface SectorDocument extends Document, Sector {}

export type SectorModel = Model<SectorDocument>;

const sectorSchema = new Schema<SectorDocument, SectorModel>(
  {
    title: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Sector', sectorSchema);
