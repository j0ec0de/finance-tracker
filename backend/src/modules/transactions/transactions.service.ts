import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { transactions } from '../../db/schema.js';
import { adjustAccountBalance } from '../accounts/accounts.service.js';
import { NotFoundError } from '../../utils/app-error.js';
import type {
  CreateTransactionInput,
  ListTransactionsQuery,
  UpdateTransactionInput,
} from './transactions.schema.js';

const balanceDelta = (type: 'expense' | 'income', amount: number) => (type === 'income' ? amount : -amount);

export const listTransactions = async (filters: ListTransactionsQuery) => {
  const conditions = [];
  if (filters.userId !== undefined) conditions.push(eq(transactions.userId, filters.userId));
  if (filters.accountId !== undefined) conditions.push(eq(transactions.accountId, filters.accountId));
  if (filters.categoryId !== undefined) conditions.push(eq(transactions.categoryId, filters.categoryId));
  if (filters.type !== undefined) conditions.push(eq(transactions.type, filters.type));
  if (filters.startDate !== undefined) conditions.push(gte(transactions.occurredAt, filters.startDate));
  if (filters.endDate !== undefined) conditions.push(lte(transactions.occurredAt, filters.endDate));

  return db
    .select()
    .from(transactions)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(transactions.occurredAt))
    .limit(filters.limit)
    .offset(filters.offset);
};

export const getTransactionById = async (id: number) => {
  const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
  if (!transaction) throw new NotFoundError('Transaction');
  return transaction;
};

export const createTransaction = async (input: CreateTransactionInput) => {
  return db.transaction(async (tx) => {
    const [transaction] = await tx
      .insert(transactions)
      .values({ ...input, amount: input.amount.toFixed(2) })
      .returning();
    await adjustAccountBalance(tx, input.accountId, balanceDelta(input.type, input.amount));
    return transaction;
  });
};

export const updateTransaction = async (id: number, input: UpdateTransactionInput) => {
  return db.transaction(async (tx) => {
    const [existing] = await tx.select().from(transactions).where(eq(transactions.id, id));
    if (!existing) throw new NotFoundError('Transaction');

    // Reverse the effect the existing transaction had on its account.
    await adjustAccountBalance(
      tx,
      existing.accountId,
      -balanceDelta(existing.type, Number(existing.amount)),
    );

    const merged = {
      accountId: input.accountId ?? existing.accountId,
      type: input.type ?? existing.type,
      amount: input.amount ?? Number(existing.amount),
    };

    const [transaction] = await tx
      .update(transactions)
      .set({ ...input, amount: input.amount?.toFixed(2) })
      .where(eq(transactions.id, id))
      .returning();

    await adjustAccountBalance(tx, merged.accountId, balanceDelta(merged.type, merged.amount));

    return transaction;
  });
};

export const deleteTransaction = async (id: number) => {
  return db.transaction(async (tx) => {
    const [transaction] = await tx.delete(transactions).where(eq(transactions.id, id)).returning();
    if (!transaction) throw new NotFoundError('Transaction');

    await adjustAccountBalance(
      tx,
      transaction.accountId,
      -balanceDelta(transaction.type, Number(transaction.amount)),
    );
  });
};
