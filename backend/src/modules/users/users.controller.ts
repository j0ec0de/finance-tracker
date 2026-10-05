import type { Request, Response } from 'express';
import { getCurrentUserId } from '../../utils/current-user.js';
import * as usersService from './users.service.js';
import { updateUserSchema } from './users.schema.js';

export const me = async (req: Request, res: Response) => {
  const user = await usersService.getUserById(getCurrentUserId(req));
  res.json(user);
};

export const update = async (req: Request, res: Response) => {
  const input = updateUserSchema.parse(req.body);
  const user = await usersService.updateUser(getCurrentUserId(req), input);
  res.json(user);
};

export const remove = async (req: Request, res: Response) => {
  await usersService.deleteUser(getCurrentUserId(req));
  res.status(204).send();
};
