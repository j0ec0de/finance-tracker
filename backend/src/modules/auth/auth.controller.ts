import type { Request, Response } from 'express';
import { UnauthorizedError } from '../../utils/app-error.js';
import * as usersService from '../users/users.service.js';
import * as authService from './auth.service.js';
import { loginSchema, registerSchema } from './auth.schema.js';

export const register = async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);
  const { user, token } = await authService.register(input);
  res.status(201).json({ user, token });
};

export const login = async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const { user, token } = await authService.login(input);
  res.json({ user, token });
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const user = await usersService.getUserById(req.user.id);
  res.json(user);
};
