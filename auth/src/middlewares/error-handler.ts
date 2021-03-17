import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // the aim is to send back a consistent error for our react app to handle

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // if just a generic error, we still need to follow the same structure
  res.status(400).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
