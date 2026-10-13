import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import * as goalsController from './goals.controller.js';

export const goalsRouter = Router();

goalsRouter.get('/', asyncHandler(goalsController.list));
goalsRouter.get('/:id', asyncHandler(goalsController.getOne));
goalsRouter.post('/', asyncHandler(goalsController.create));
goalsRouter.patch('/:id', asyncHandler(goalsController.update));
goalsRouter.delete('/:id', asyncHandler(goalsController.remove));
