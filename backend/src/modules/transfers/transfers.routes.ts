import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import * as transfersController from './transfers.controller.js';

export const transfersRouter = Router();

transfersRouter.post('/', asyncHandler(transfersController.create));
