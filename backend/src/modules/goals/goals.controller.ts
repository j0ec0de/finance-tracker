import type { Request, Response } from 'express';
import { getCurrentUserId } from '../../utils/current-user.js';
import { idParamSchema } from '../../utils/id-param.schema.js';
import * as goalsService from './goals.service.js';
import { createGoalSchema, updateGoalSchema } from './goals.schema.js';

export const list = async (req: Request, res: Response) => {
  const goals = await goalsService.listGoals(getCurrentUserId(req));
  res.json(goals);
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const goal = await goalsService.getGoalById(getCurrentUserId(req), id);
  res.json(goal);
};

export const create = async (req: Request, res: Response) => {
  const input = createGoalSchema.parse(req.body);
  const goal = await goalsService.createGoal(getCurrentUserId(req), input);
  res.status(201).json(goal);
};

export const update = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const input = updateGoalSchema.parse(req.body);
  const goal = await goalsService.updateGoal(getCurrentUserId(req), id, input);
  res.json(goal);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  await goalsService.deleteGoal(getCurrentUserId(req), id);
  res.status(204).send();
};
