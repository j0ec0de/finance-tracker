import { z } from 'zod';

const transactionTypes = ['expense', 'income'] as const;

export const createCategorySchema = z.object({
  userId: z.coerce.number().int().positive(),
  name: z.string().trim().min(1),
  type: z.enum(transactionTypes).default('expense'),
  icon: z.string().trim().min(1).optional(),
  color: z.string().trim().min(1).optional(),
});

export const updateCategorySchema = createCategorySchema.omit({ userId: true }).partial();

export const listCategoriesQuerySchema = z.object({
  userId: z.coerce.number().int().positive().optional(),
  type: z.enum(transactionTypes).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
