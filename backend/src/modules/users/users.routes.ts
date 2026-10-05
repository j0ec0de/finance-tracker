import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import * as usersController from './users.controller.js';

export const usersRouter = Router();

// Users can only act on their own account; there is no cross-user listing or lookup.
usersRouter.get('/me', asyncHandler(usersController.me));
usersRouter.patch('/me', asyncHandler(usersController.update));
usersRouter.delete('/me', asyncHandler(usersController.remove));
