import { z } from 'zod';
import { positiveIdSchema } from '../../utils/id-param.schema.js';

const transactionTypes = ['expense', 'income'] as const;

export const createTransactionSchema = z.object({
  accountId: positiveIdSchema,
  categoryId: positiveIdSchema.optional(),
  type: z.enum(transactionTypes),
  amount: z.coerce.number().positive(),
  description: z.string().trim().min(1).optional(),
  occurredAt: z.coerce.date().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const listTransactionsQuerySchema = z.object({
  accountId: positiveIdSchema.optional(),
  categoryId: positiveIdSchema.optional(),
  type: z.enum(transactionTypes).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  limit: z.coerce.number().int().positive().max(200).default(50),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;
