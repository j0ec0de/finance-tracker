import { eq, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { accounts } from '../../db/schema.js';
import { NotFoundError } from '../../utils/app-error.js';
import type { CreateAccountInput, UpdateAccountInput } from './accounts.schema.js';

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
type Executor = typeof db | Tx;

export const listAccounts = async (userId?: number) => {
  if (userId === undefined) return db.select().from(accounts);
  return db.select().from(accounts).where(eq(accounts.userId, userId));
};

export const getAccountById = async (id: number) => {
  const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
  if (!account) throw new NotFoundError('Account');
  return account;
};

export const createAccount = async (input: CreateAccountInput) => {
  const [account] = await db
    .insert(accounts)
    .values({ ...input, balance: input.balance.toFixed(2) })
    .returning();
  return account;
};

export const updateAccount = async (id: number, input: UpdateAccountInput) => {
  const [account] = await db
    .update(accounts)
    .set({ ...input, balance: input.balance?.toFixed(2) })
    .where(eq(accounts.id, id))
    .returning();
  if (!account) throw new NotFoundError('Account');
  return account;
};

export const deleteAccount = async (id: number) => {
  const [account] = await db.delete(accounts).where(eq(accounts.id, id)).returning();
  if (!account) throw new NotFoundError('Account');
};

/** Applies a signed delta (positive or negative) to an account's balance. */
export const adjustAccountBalance = async (executor: Executor, accountId: number, delta: number) => {
  await executor
    .update(accounts)
    .set({ balance: sql`${accounts.balance} + ${delta.toFixed(2)}` })
    .where(eq(accounts.id, accountId));
};
