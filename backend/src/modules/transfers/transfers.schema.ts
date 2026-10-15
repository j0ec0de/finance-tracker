import { z } from 'zod';
import { positiveIdSchema } from '../../utils/id-param.schema.js';

export const createTransferSchema = z
  .object({
    fromAccountId: positiveIdSchema,
    toAccountId: positiveIdSchema,
    amount: z.coerce.number().positive(),
    description: z.string().trim().min(1).optional(),
    occurredAt: z.coerce.date().optional(),
  })
  .refine((value) => value.fromAccountId !== value.toAccountId, {
    message: 'fromAccountId and toAccountId must differ',
    path: ['toAccountId'],
  });

export type CreateTransferInput = z.infer<typeof createTransferSchema>;
