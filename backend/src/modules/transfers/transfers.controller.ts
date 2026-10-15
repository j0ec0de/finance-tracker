import type { Request, Response } from 'express';
import { getCurrentUserId } from '../../utils/current-user.js';
import * as transfersService from './transfers.service.js';
import { createTransferSchema } from './transfers.schema.js';

export const create = async (req: Request, res: Response) => {
  const input = createTransferSchema.parse(req.body);
  const transfer = await transfersService.createTransfer(getCurrentUserId(req), input);
  res.status(201).json(transfer);
};
