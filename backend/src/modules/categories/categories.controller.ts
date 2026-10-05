import type { Request, Response } from 'express';
import { getCurrentUserId } from '../../utils/current-user.js';
import { idParamSchema } from '../../utils/id-param.schema.js';
import * as categoriesService from './categories.service.js';
import {
  createCategorySchema,
  listCategoriesQuerySchema,
  updateCategorySchema,
} from './categories.schema.js';

export const list = async (req: Request, res: Response) => {
  const filters = listCategoriesQuerySchema.parse(req.query);
  const categories = await categoriesService.listCategories(getCurrentUserId(req), filters);
  res.json(categories);
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const category = await categoriesService.getCategoryById(getCurrentUserId(req), id);
  res.json(category);
};

export const create = async (req: Request, res: Response) => {
  const input = createCategorySchema.parse(req.body);
  const category = await categoriesService.createCategory(getCurrentUserId(req), input);
  res.status(201).json(category);
};

export const update = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const input = updateCategorySchema.parse(req.body);
  const category = await categoriesService.updateCategory(getCurrentUserId(req), id, input);
  res.json(category);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  await categoriesService.deleteCategory(getCurrentUserId(req), id);
  res.status(204).send();
};
