import passport from 'passport';
import { Response, NextFunction, Request } from 'express';

import { UserDocument } from 'models/user.model';

export interface AuthorizeOptions {
  redirect?: boolean;
  allowInactive?: boolean;
}

function handleJWT(req: Request, res: Response, next: NextFunction) {
  return async (err: string, user: UserDocument) => {
    try {
      req.logIn(user, { session: false }, () => {
        req.user = user;
        next();
      });
    } catch (e) {
      next();
    }
  };
}

export default function authorize(req: Request, res: Response, next: NextFunction) {
  return passport.authenticate('jwt', { session: false }, handleJWT(req, res, next))(req, res, next);
}
