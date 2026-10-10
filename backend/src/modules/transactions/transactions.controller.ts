import type { Request, Response } from 'express';
import { getCurrentUserId } from '../../utils/current-user.js';
import { idParamSchema } from '../../utils/id-param.schema.js';
import * as transactionsService from './transactions.service.js';
import {
  createTransactionSchema,
  listTransactionsQuerySchema,
  summaryQuerySchema,
  updateTransactionSchema,
} from './transactions.schema.js';

export const list = async (req: Request, res: Response) => {
  const filters = listTransactionsQuerySchema.parse(req.query);
  const { data, total } = await transactionsService.listTransactions(getCurrentUserId(req), filters);
  res.json({ data, total, limit: filters.limit, offset: filters.offset });
};

export const summary = async (req: Request, res: Response) => {
  const filters = summaryQuerySchema.parse(req.query);
  const result = await transactionsService.getTransactionsSummary(getCurrentUserId(req), filters);
  res.json(result);
};

export const byCategory = async (req: Request, res: Response) => {
  const filters = summaryQuerySchema.parse(req.query);
  const data = await transactionsService.getTransactionsByCategory(getCurrentUserId(req), filters);
  res.json({ data });
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const transaction = await transactionsService.getTransactionById(getCurrentUserId(req), id);
  res.json(transaction);
};

export const create = async (req: Request, res: Response) => {
  const input = createTransactionSchema.parse(req.body);
  const transaction = await transactionsService.createTransaction(getCurrentUserId(req), input);
  res.status(201).json(transaction);
};

export const update = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const input = updateTransactionSchema.parse(req.body);
  const transaction = await transactionsService.updateTransaction(getCurrentUserId(req), id, input);
  res.json(transaction);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  await transactionsService.deleteTransaction(getCurrentUserId(req), id);
  res.status(204).send();
};
