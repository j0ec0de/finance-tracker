import { z } from 'zod';
import { positiveIdSchema } from '../../utils/id-param.schema.js';

const budgetPeriods = ['weekly', 'monthly'] as const;

export const createBudgetSchema = z.object({
  categoryId: positiveIdSchema,
  limit: z.coerce.number().positive(),
  period: z.enum(budgetPeriods).default('monthly'),
});

export const updateBudgetSchema = createBudgetSchema.partial();

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type BudgetPeriod = (typeof budgetPeriods)[number];
