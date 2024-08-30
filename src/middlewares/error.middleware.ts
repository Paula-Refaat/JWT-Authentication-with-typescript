import express, { NextFunction, Request, Response } from 'express';
import Error from '../interface/error.interface';

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  res.status(status).send({
    status,
    message,
  });
};

export default errorMiddleware;
