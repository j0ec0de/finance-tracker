import { z } from 'zod';

const accountTypes = ['cash', 'bank', 'credit_card', 'wallet', 'investment', 'other'] as const;

export const createAccountSchema = z.object({
  name: z.string().trim().min(1),
  type: z.enum(accountTypes).default('cash'),
  balance: z.coerce.number().finite().default(0),
  currency: z.string().trim().length(3).toUpperCase().default('USD'),
});

// Balance is derived from transactions after creation, so it cannot be edited directly.
export const updateAccountSchema = createAccountSchema.omit({ balance: true }).partial();

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
