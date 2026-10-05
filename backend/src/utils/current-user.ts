import type { Request } from 'express';
import { UnauthorizedError } from './app-error.js';

/** Returns the authenticated user's id. Only valid behind `requireAuth`. */
export const getCurrentUserId = (req: Request): number => {
  if (!req.user) throw new UnauthorizedError();
  return req.user.id;
};
