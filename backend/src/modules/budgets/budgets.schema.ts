import { z } from 'zod';
import { positiveIdSchema } from '../../utils/id-param.schema.js';
import { nonEmptyUpdate } from '../../utils/non-empty-update.schema.js';

const budgetPeriods = ['weekly', 'monthly'] as const;

const budgetFields = {
  categoryId: positiveIdSchema,
  limit: z.coerce.number().positive(),
  period: z.enum(budgetPeriods),
};

export const createBudgetSchema = z.object({
  ...budgetFields,
  period: budgetFields.period.default('monthly'),
});

// Deliberately no defaults: on a PATCH a default would fire for every omitted
// key and overwrite the stored value with it.
export const updateBudgetSchema = nonEmptyUpdate(z.object(budgetFields).partial());

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type BudgetPeriod = (typeof budgetPeriods)[number];
