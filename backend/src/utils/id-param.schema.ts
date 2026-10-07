import { z } from 'zod';

// Ids are Postgres `integer` columns; anything larger fails in the database instead of the request.
const POSTGRES_INTEGER_MAX = 2147483647;

export const positiveIdSchema = z.coerce.number().int().positive().max(POSTGRES_INTEGER_MAX);

export const idParamSchema = z.object({
  id: positiveIdSchema,
});
