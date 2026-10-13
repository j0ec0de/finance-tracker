import type { Request, Response } from 'express';
import { getCurrentUserId } from '../../utils/current-user.js';
import { idParamSchema } from '../../utils/id-param.schema.js';
import * as budgetsService from './budgets.service.js';
import { createBudgetSchema, updateBudgetSchema } from './budgets.schema.js';

export const list = async (req: Request, res: Response) => {
  const budgets = await budgetsService.listBudgets(getCurrentUserId(req));
  res.json(budgets);
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const budget = await budgetsService.getBudgetById(getCurrentUserId(req), id);
  res.json(budget);
};

export const create = async (req: Request, res: Response) => {
  const input = createBudgetSchema.parse(req.body);
  const budget = await budgetsService.createBudget(getCurrentUserId(req), input);
  res.status(201).json(budget);
};

export const update = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const input = updateBudgetSchema.parse(req.body);
  const budget = await budgetsService.updateBudget(getCurrentUserId(req), id, input);
  res.json(budget);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  await budgetsService.deleteBudget(getCurrentUserId(req), id);
  res.status(204).send();
};
