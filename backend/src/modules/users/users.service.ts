import { and, eq, ne } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { ConflictError, NotFoundError } from '../../utils/app-error.js';
import { hashPassword } from '../../utils/password.js';
import type { UpdateUserInput } from './users.schema.js';

const publicColumns = {
  id: users.id,
  name: users.name,
  email: users.email,
  createdAt: users.createdAt,
};

export const getUserById = async (id: number) => {
  const [user] = await db.select(publicColumns).from(users).where(eq(users.id, id));
  if (!user) throw new NotFoundError('User');
  return user;
};

export const updateUser = async (id: number, input: UpdateUserInput) => {
  if (input.email !== undefined) {
    const [taken] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.email, input.email), ne(users.id, id)));
    if (taken) throw new ConflictError('Email is already registered');
  }

  const { password, ...rest } = input;
  const passwordHash = password ? await hashPassword(password) : undefined;
  const [user] = await db
    .update(users)
    .set({ ...rest, ...(passwordHash ? { passwordHash } : {}) })
    .where(eq(users.id, id))
    .returning(publicColumns);
  if (!user) throw new NotFoundError('User');
  return user;
};

export const deleteUser = async (id: number) => {
  const [user] = await db.delete(users).where(eq(users.id, id)).returning();
  if (!user) throw new NotFoundError('User');
};
