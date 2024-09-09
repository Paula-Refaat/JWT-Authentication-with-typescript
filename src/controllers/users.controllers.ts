import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user.model';

const userModel = new UserModel();

export const create = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userModel.create(_req.body);
    res.status(201).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userModel.getAll();
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userModel.getById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userModel.update(req.params.id, req.body);
    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userModel.delete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
