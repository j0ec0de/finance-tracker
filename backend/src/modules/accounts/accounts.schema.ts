import { z } from 'zod';

const accountTypes = ['cash', 'bank', 'credit_card', 'wallet', 'investment', 'other'] as const;

export const createAccountSchema = z.object({
  name: z.string().trim().min(1),
  type: z.enum(accountTypes).default('cash'),
  balance: z.coerce.number().finite().default(0),
  currency: z.string().trim().length(3).toUpperCase().default('USD'),
});

export const updateAccountSchema = createAccountSchema.partial();

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
