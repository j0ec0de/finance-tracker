import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8),
  })
  .partial();

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
