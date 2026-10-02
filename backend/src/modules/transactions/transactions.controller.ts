import type { Request, Response } from 'express';
import { idParamSchema } from '../../utils/id-param.schema.js';
import * as transactionsService from './transactions.service.js';
import {
  createTransactionSchema,
  listTransactionsQuerySchema,
  updateTransactionSchema,
} from './transactions.schema.js';

export const list = async (req: Request, res: Response) => {
  const filters = listTransactionsQuerySchema.parse(req.query);
  const transactions = await transactionsService.listTransactions(filters);
  res.json(transactions);
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const transaction = await transactionsService.getTransactionById(id);
  res.json(transaction);
};

export const create = async (req: Request, res: Response) => {
  const input = createTransactionSchema.parse(req.body);
  const transaction = await transactionsService.createTransaction(input);
  res.status(201).json(transaction);
};

export const update = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const input = updateTransactionSchema.parse(req.body);
  const transaction = await transactionsService.updateTransaction(id, input);
  res.json(transaction);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  await transactionsService.deleteTransaction(id);
  res.status(204).send();
};
