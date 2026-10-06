import { and, eq, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import type { Executor } from '../../db/executor.js';
import { accounts } from '../../db/schema.js';
import { NotFoundError } from '../../utils/app-error.js';
import type { CreateAccountInput, UpdateAccountInput } from './accounts.schema.js';

export const listAccounts = async (userId: number) => {
  return db.select().from(accounts).where(eq(accounts.userId, userId));
};

export const getAccountById = async (userId: number, id: number) => {
  const [account] = await db
    .select()
    .from(accounts)
    .where(and(eq(accounts.id, id), eq(accounts.userId, userId)));
  if (!account) throw new NotFoundError('Account');
  return account;
};

export const createAccount = async (userId: number, input: CreateAccountInput) => {
  const [account] = await db
    .insert(accounts)
    .values({ ...input, userId, balance: input.balance.toFixed(2) })
    .returning();
  return account;
};

export const updateAccount = async (userId: number, id: number, input: UpdateAccountInput) => {
  const [account] = await db
    .update(accounts)
    .set(input)
    .where(and(eq(accounts.id, id), eq(accounts.userId, userId)))
    .returning();
  if (!account) throw new NotFoundError('Account');
  return account;
};

export const deleteAccount = async (userId: number, id: number) => {
  const [account] = await db
    .delete(accounts)
    .where(and(eq(accounts.id, id), eq(accounts.userId, userId)))
    .returning();
  if (!account) throw new NotFoundError('Account');
};

/** Throws NotFoundError unless the account exists and belongs to the user. */
export const assertAccountOwned = async (executor: Executor, userId: number, accountId: number) => {
  const [account] = await executor
    .select({ id: accounts.id })
    .from(accounts)
    .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)));
  if (!account) throw new NotFoundError('Account');
};

/** Applies a signed delta (positive or negative) to an account's balance. */
export const adjustAccountBalance = async (executor: Executor, accountId: number, delta: number) => {
  await executor
    .update(accounts)
    .set({ balance: sql`${accounts.balance} + ${delta.toFixed(2)}` })
    .where(eq(accounts.id, accountId));
};
