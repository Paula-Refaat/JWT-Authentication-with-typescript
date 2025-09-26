import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import IError from '../interface/error.interface';
import config from '../config';

const handelUnauthorizedError = (next: NextFunction) => {
  const error: IError = new Error('Unauthorized');
  error.status = 401;
  next(error);
};

const validateTokenMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const bearer: string = authHeader.split(' ')[0].toLowerCase();
      const token: string = authHeader.split(' ')[1];
      if (token && bearer === 'bearer') {
        const decode = jwt.verify(
          token,
          config.tokenSecret as unknown as string,
        );
        if (decode) {
          next();
        } else {
          handelUnauthorizedError(next);
        }
      } else {
        handelUnauthorizedError(next);
      }
    } else {
      handelUnauthorizedError(next);
    }
  } catch (error) {
    handelUnauthorizedError(next);
  }
};

export default validateTokenMiddleware;
