import type { Request, Response } from 'express';
import { getCurrentUserId } from '../../utils/current-user.js';
import { idParamSchema } from '../../utils/id-param.schema.js';
import * as accountsService from './accounts.service.js';
import { createAccountSchema, updateAccountSchema } from './accounts.schema.js';

export const list = async (req: Request, res: Response) => {
  const accounts = await accountsService.listAccounts(getCurrentUserId(req));
  res.json(accounts);
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const account = await accountsService.getAccountById(getCurrentUserId(req), id);
  res.json(account);
};

export const create = async (req: Request, res: Response) => {
  const input = createAccountSchema.parse(req.body);
  const account = await accountsService.createAccount(getCurrentUserId(req), input);
  res.status(201).json(account);
};

export const update = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const input = updateAccountSchema.parse(req.body);
  const account = await accountsService.updateAccount(getCurrentUserId(req), id, input);
  res.json(account);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  await accountsService.deleteAccount(getCurrentUserId(req), id);
  res.status(204).send();
};
