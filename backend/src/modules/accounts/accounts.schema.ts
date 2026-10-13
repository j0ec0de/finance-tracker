import { z } from 'zod';
import { nonEmptyUpdate } from '../../utils/non-empty-update.schema.js';

const accountTypes = ['cash', 'bank', 'credit_card', 'wallet', 'investment', 'other'] as const;

const accountFields = {
  name: z.string().trim().min(1),
  type: z.enum(accountTypes),
  balance: z.coerce.number().finite(),
  currency: z.string().trim().length(3).toUpperCase(),
};

export const createAccountSchema = z.object({
  ...accountFields,
  type: accountFields.type.default('cash'),
  balance: accountFields.balance.default(0),
  currency: accountFields.currency.default('USD'),
});

// Balance is derived from transactions after creation, so it cannot be edited directly.
// Built from the no-default base: a Zod `.default()` survives `.partial()` and would reset an
// omitted field to the default on every PATCH.
export const updateAccountSchema = nonEmptyUpdate(
  z.object(accountFields).omit({ balance: true }).partial(),
);

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
