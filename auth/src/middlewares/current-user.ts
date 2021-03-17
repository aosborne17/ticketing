import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

//
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// check if user is logged in and if so, set it on req.currentUser
// we will simply check if the current user has a req.session.jwt cookie
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  // decode jwt to check it valid
  // passing in the jwt and the secret key will decode the token
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    // we can now set the request to have this new property
    // this allows all parts of our app to access this property
    req.currentUser = payload;
  } catch (err) {}
  next();
};
