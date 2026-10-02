import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import * as transactionsController from './transactions.controller.js';

export const transactionsRouter = Router();

transactionsRouter.get('/', asyncHandler(transactionsController.list));
transactionsRouter.get('/:id', asyncHandler(transactionsController.getOne));
transactionsRouter.post('/', asyncHandler(transactionsController.create));
transactionsRouter.patch('/:id', asyncHandler(transactionsController.update));
transactionsRouter.delete('/:id', asyncHandler(transactionsController.remove));
