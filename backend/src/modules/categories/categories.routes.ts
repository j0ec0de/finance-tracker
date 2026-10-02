import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import * as categoriesController from './categories.controller.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', asyncHandler(categoriesController.list));
categoriesRouter.get('/:id', asyncHandler(categoriesController.getOne));
categoriesRouter.post('/', asyncHandler(categoriesController.create));
categoriesRouter.patch('/:id', asyncHandler(categoriesController.update));
categoriesRouter.delete('/:id', asyncHandler(categoriesController.remove));
