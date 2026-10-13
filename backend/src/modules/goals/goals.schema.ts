import { z } from 'zod';
import { nonEmptyUpdate } from '../../utils/non-empty-update.schema.js';

const goalFields = {
  name: z.string().trim().min(1),
  targetAmount: z.coerce.number().positive(),
  savedAmount: z.coerce.number().nonnegative(),
  // Nullable so an existing target date can be cleared through PATCH.
  targetDate: z.coerce.date().nullish(),
};

export const createGoalSchema = z.object({
  ...goalFields,
  savedAmount: goalFields.savedAmount.default(0),
});

// Deliberately no defaults: on a PATCH a default would fire for every omitted
// key and overwrite the stored value with it.
export const updateGoalSchema = nonEmptyUpdate(z.object(goalFields).partial());

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
