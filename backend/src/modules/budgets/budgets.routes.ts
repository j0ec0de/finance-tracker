import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import * as budgetsController from './budgets.controller.js';

export const budgetsRouter = Router();

budgetsRouter.get('/', asyncHandler(budgetsController.list));
budgetsRouter.get('/:id', asyncHandler(budgetsController.getOne));
budgetsRouter.post('/', asyncHandler(budgetsController.create));
budgetsRouter.patch('/:id', asyncHandler(budgetsController.update));
budgetsRouter.delete('/:id', asyncHandler(budgetsController.remove));
