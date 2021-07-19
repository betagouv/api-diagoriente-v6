import mongoose, { Document, Model, PopulatedDoc, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import moment from 'moment';

import { env, expirationInterval, accessSecret } from 'config/vars';
import { GroupDocument } from './group.model';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  ADVISOR = 'advisor',
}

const roles = [Role.USER, Role.ADMIN, Role.ADVISOR];

export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  structure: string;
  isReferentiel: boolean;
  tutorialStep: number;
  lastLogin: string;
  location: {
    address: string;
    lat: number;
    lng: number;
    postCode: string;
  };
  group: PopulatedDoc<GroupDocument>;
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
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      max: 30,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      max: 30,
      required: true,
    },
    structure: {
      type: String,
      trim: true,
    },
    isReferentiel: {
      type: Boolean,
    },
    tutorialStep: {
      type: Number,
      default: 0,
    },
    location: {
      address: {
        type: String,
      },
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
      postCode: {
        type: String,
      },
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.virtual('skills', {
  ref: 'Skill',
  localField: '_id',
  foreignField: 'user',
});

userSchema.virtual('volunteers', {
  ref: 'Volunteer',
  localField: '_id',
  foreignField: 'user',
});

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
    // add lastLogin
    return { token, expiresIn: expiresIn.toISOString() };
  },

  passwordMatches(password: string) {
    return bcrypt.compare(password, this.password);
  },
});

export default mongoose.model('User', userSchema);
