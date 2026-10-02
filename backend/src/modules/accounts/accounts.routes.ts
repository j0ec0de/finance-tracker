import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import * as accountsController from './accounts.controller.js';

export const accountsRouter = Router();

accountsRouter.get('/', asyncHandler(accountsController.list));
accountsRouter.get('/:id', asyncHandler(accountsController.getOne));
accountsRouter.post('/', asyncHandler(accountsController.create));
accountsRouter.patch('/:id', asyncHandler(accountsController.update));
accountsRouter.delete('/:id', asyncHandler(accountsController.remove));
