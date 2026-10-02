import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { ConflictError, UnauthorizedError } from '../../utils/app-error.js';
import { signAccessToken } from '../../utils/jwt.js';
import { comparePassword, hashPassword } from '../../utils/password.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

const publicColumns = {
  id: users.id,
  name: users.name,
  email: users.email,
  createdAt: users.createdAt,
};

export const register = async (input: RegisterInput) => {
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, input.email));
  if (existing) throw new ConflictError('Email is already registered');

  const passwordHash = await hashPassword(input.password);
  const [user] = await db
    .insert(users)
    .values({ name: input.name, email: input.email, passwordHash })
    .returning(publicColumns);
  if (!user) throw new Error('Failed to create user');

  const token = signAccessToken({ sub: user.id, email: user.email });
  return { user, token };
};

export const login = async (input: LoginInput) => {
  const [user] = await db.select().from(users).where(eq(users.email, input.email));
  if (!user) throw new UnauthorizedError('Invalid email or password');

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) throw new UnauthorizedError('Invalid email or password');

  const { passwordHash: _passwordHash, ...publicUser } = user;
  const token = signAccessToken({ sub: publicUser.id, email: publicUser.email });
  return { user: publicUser, token };
};
