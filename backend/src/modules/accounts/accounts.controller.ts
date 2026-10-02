import type { Request, Response } from 'express';
import { idParamSchema } from '../../utils/id-param.schema.js';
import * as accountsService from './accounts.service.js';
import { createAccountSchema, listAccountsQuerySchema, updateAccountSchema } from './accounts.schema.js';

export const list = async (req: Request, res: Response) => {
  const { userId } = listAccountsQuerySchema.parse(req.query);
  const accounts = await accountsService.listAccounts(userId);
  res.json(accounts);
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const account = await accountsService.getAccountById(id);
  res.json(account);
};

export const create = async (req: Request, res: Response) => {
  const input = createAccountSchema.parse(req.body);
  const account = await accountsService.createAccount(input);
  res.status(201).json(account);
};

export const update = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const input = updateAccountSchema.parse(req.body);
  const account = await accountsService.updateAccount(id, input);
  res.json(account);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  await accountsService.deleteAccount(id);
  res.status(204).send();
};
