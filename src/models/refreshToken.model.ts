import mongoose, { Schema, Model, Document } from 'mongoose';

import crypto from 'crypto';
import moment from 'moment';

import { UserDocument } from './user.model';

export interface RefreshToken {
  token: string;
  userEmail: string;
  userId: Schema.Types.ObjectId;
  expires: Date;
  agent: string;
}

export interface RefreshTokenDocument extends Document, RefreshToken {}

export interface IRefreshTokenModel extends Model<RefreshTokenDocument> {
  generate: (user: UserDocument, agent: string) => Promise<RefreshTokenDocument>;
}

/**
 * Refresh Token Schema
 * @private
 */
const refreshTokenSchema = new mongoose.Schema<RefreshTokenDocument, IRefreshTokenModel>({
  token: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userEmail: {
    type: String,
    ref: 'User',
    required: true,
  },
  agent: {
    type: String,
  },
  expires: { type: Date },
});

refreshTokenSchema.statics = {
  async generate(user: UserDocument, agent: string) {
    const userId = user._id;
    const userEmail = user.email;
    const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(30, 'days').toDate();
    await this.remove({ agent, userId });
    const tokenObject = new this({
      token,
      userId,
      userEmail,
      expires,
      agent,
    });
    await tokenObject.save();
    return tokenObject;
  },
};

export default mongoose.model('RefreshToken', refreshTokenSchema);
