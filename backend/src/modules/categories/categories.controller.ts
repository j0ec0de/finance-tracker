import type { Request, Response } from 'express';
import { idParamSchema } from '../../utils/id-param.schema.js';
import * as categoriesService from './categories.service.js';
import {
  createCategorySchema,
  listCategoriesQuerySchema,
  updateCategorySchema,
} from './categories.schema.js';

export const list = async (req: Request, res: Response) => {
  const filters = listCategoriesQuerySchema.parse(req.query);
  const categories = await categoriesService.listCategories(filters);
  res.json(categories);
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const category = await categoriesService.getCategoryById(id);
  res.json(category);
};

export const create = async (req: Request, res: Response) => {
  const input = createCategorySchema.parse(req.body);
  const category = await categoriesService.createCategory(input);
  res.status(201).json(category);
};

export const update = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const input = updateCategorySchema.parse(req.body);
  const category = await categoriesService.updateCategory(id, input);
  res.json(category);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  await categoriesService.deleteCategory(id);
  res.status(204).send();
};
