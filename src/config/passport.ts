import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { accessSecret } from './vars';

import User, { UserDocument } from 'models/user.model';

const jwtOptions = {
  secretOrKey: accessSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwt = async (payload: { sub: string }, done: (e: Error | null, user: UserDocument | boolean) => void) => {
  try {
    const user = await User.findById(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

export default {
  jwt: new JwtStrategy(jwtOptions, jwt),
};
