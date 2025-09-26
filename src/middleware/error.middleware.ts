import { NextFunction, Request, Response } from 'express';
import IError from '../interface/error.interface';

const errorMiddleware = (
  error: IError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';
  res.status(status).json({ status, message, stack: error.stack });
  next();
};

export default errorMiddleware;
