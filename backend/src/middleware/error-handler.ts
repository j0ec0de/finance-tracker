import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error.js';

const FOREIGN_KEY_VIOLATION = '23503';

// Drizzle wraps driver errors, so the Postgres code may sit on the error itself or on its cause.
const postgresErrorCode = (err: unknown): string | undefined => {
  const { code, cause } = err as { code?: unknown; cause?: { code?: unknown } };
  if (typeof code === 'string') return code;
  if (typeof cause?.code === 'string') return cause.code;
  return undefined;
};

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation failed', details: err.issues });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Ownership checks run first, so this only fires if a referenced row is removed mid-request.
  if (postgresErrorCode(err) === FOREIGN_KEY_VIOLATION) {
    res.status(400).json({ error: 'Referenced account or category does not exist' });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
