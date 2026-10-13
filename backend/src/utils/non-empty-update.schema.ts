import type { z } from 'zod';

/**
 * Rejects a PATCH body with no recognised fields. Without this the service hands an empty object
 * to Drizzle's `.set()`, which throws "No values to set" and surfaces as a 500.
 */
export const nonEmptyUpdate = <T extends z.ZodObject>(schema: T) =>
  schema.refine((value) => Object.keys(value).length > 0, {
    message: 'Provide at least one field to update',
  });
