import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import * as usersController from './users.controller.js';

export const usersRouter = Router();

usersRouter.get('/', asyncHandler(usersController.list));
usersRouter.get('/:id', asyncHandler(usersController.getOne));
usersRouter.post('/', asyncHandler(usersController.create));
usersRouter.patch('/:id', asyncHandler(usersController.update));
usersRouter.delete('/:id', asyncHandler(usersController.remove));
