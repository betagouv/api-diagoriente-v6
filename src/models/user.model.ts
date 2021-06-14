import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import moment from 'moment';

import { env, expirationInterval, accessSecret } from 'config/vars';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

const roles = [Role.USER, Role.ADMIN];

export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface UserDocument extends Document, User {
  generateToken: () => { token: string; expiresIn: string };
  passwordMatches: (password: string) => Promise<boolean>;
}

export type UserModel = Model<UserDocument>;

const userSchema = new mongoose.Schema<UserDocument, UserModel>(
  {
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
      max: 30,
    },
    lastName: {
      type: String,
      trim: true,
      max: 30,
    },
  },
  {
    timestamps: true,
  },
);

export async function hash(password: string) {
  const rounds = env === 'test' ? 1 : 10;
  return await bcrypt.hash(password, rounds);
}

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password);
    next();
  } catch (e) {
    return next(e);
  }
});

/**
 * Methods
 */
userSchema.method({
  generateToken() {
    const payload = {
      sub: this._id,
    };

    const expiresIn = moment().add(expirationInterval, 'minutes');

    const token = jwt.sign(payload, accessSecret, { expiresIn: expiresIn.unix() });

    return { token, expiresIn: expiresIn.toISOString() };
  },

  passwordMatches(password: string) {
    return bcrypt.compare(password, this.password);
  },
});

export default mongoose.model('User', userSchema);
