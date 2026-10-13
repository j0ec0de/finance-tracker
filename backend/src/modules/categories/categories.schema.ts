import { z } from 'zod';
import { nonEmptyUpdate } from '../../utils/non-empty-update.schema.js';

const transactionTypes = ['expense', 'income'] as const;

const categoryFields = {
  name: z.string().trim().min(1),
  type: z.enum(transactionTypes),
  icon: z.string().trim().min(1).optional(),
  color: z.string().trim().min(1).optional(),
};

export const createCategorySchema = z.object({
  ...categoryFields,
  type: categoryFields.type.default('expense'),
});

// Built from the no-default base: a Zod `.default()` survives `.partial()` and would reset an
// omitted field to the default on every PATCH.
export const updateCategorySchema = nonEmptyUpdate(z.object(categoryFields).partial());

export const listCategoriesQuerySchema = z.object({
  type: z.enum(transactionTypes).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>;
