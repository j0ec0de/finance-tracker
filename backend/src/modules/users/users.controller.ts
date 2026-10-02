import type { Request, Response } from 'express';
import { idParamSchema } from '../../utils/id-param.schema.js';
import * as usersService from './users.service.js';
import { createUserSchema, updateUserSchema } from './users.schema.js';

export const list = async (req: Request, res: Response) => {
  const users = await usersService.listUsers();
  res.json(users);
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const user = await usersService.getUserById(id);
  res.json(user);
};

export const create = async (req: Request, res: Response) => {
  const input = createUserSchema.parse(req.body);
  const user = await usersService.createUser(input);
  res.status(201).json(user);
};

export const update = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const input = updateUserSchema.parse(req.body);
  const user = await usersService.updateUser(id, input);
  res.json(user);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  await usersService.deleteUser(id);
  res.status(204).send();
};
