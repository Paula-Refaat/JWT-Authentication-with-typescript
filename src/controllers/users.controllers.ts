import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import User from '../types/user.type';
import config from '../config';
const userModel = new UserModel();

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user: User = await userModel.create(req.body);
    res.status(200).json({
      status: 'success',
      data: { ...user },
      message: 'user created success',
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users: User[] = await userModel.getAll();
    res.status(200).json({
      status: 'success',
      data: { users },
      message: 'users retrieved success',
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user: User = await userModel.getOne(
      req.params.id as unknown as string,
    );
    res.status(200).json({
      status: 'success',
      data: { user },
      message: 'user retrieved success',
    });
  } catch (error) {
    next(error);
  }
};

export const updateOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userModel.updateOne(
      req.body as User,
      req.params.is as unknown as string,
    );
    res.status(200).json({
      status: 'success',
      data: { user },
      message: 'user updated success',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await userModel.deleteOne(req.params.id as unknown as string);
    res.status(200).json({
      status: 'success',
      message: 'user deleted success',
    });
  } catch (error) {
    next(error);
  }
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.authenticate(email, password);
    const token = jwt.sign({ user }, config.tokenSecret as unknown as string);
    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'the email and password do not match please tye again ',
      });
    }
    res.status(200).json({
      status: 'success',
      data: { ...user, token },
      message: 'user authenticated successfully',
    });
  } catch (error) {
    return next(error); 
  }
};
