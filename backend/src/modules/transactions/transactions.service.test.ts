import { eq } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../db/index.js';
import { accounts } from '../../db/schema.js';
import { ConflictError } from '../../utils/app-error.js';
import { createTestAccount, createTestCategory, createTestUser, deleteTestUser } from '../../test/helpers.js';
import { createTransfer } from '../transfers/transfers.service.js';
import {
  createTransaction,
  deleteTransaction,
  getTransactionsByCategory,
  getTransactionsSummary,
  updateTransaction,
} from './transactions.service.js';

const getBalance = async (accountId: number) => {
  const [account] = await db.select().from(accounts).where(eq(accounts.id, accountId));
  return Number(account?.balance);
};

describe('transaction balance logic', () => {
  let userId: number;

  beforeEach(async () => {
    const user = await createTestUser();
    userId = user.id;
  });

  afterEach(async () => {
    await deleteTestUser(userId);
  });

  describe('createTransaction', () => {
    it('increases the account balance for an income transaction', async () => {
      const account = await createTestAccount(userId, 100);
      await createTransaction(userId, { accountId: account.id, type: 'income', amount: 50 });
      expect(await getBalance(account.id)).toBe(150);
    });

    it('decreases the account balance for an expense transaction', async () => {
      const account = await createTestAccount(userId, 100);
      await createTransaction(userId, { accountId: account.id, type: 'expense', amount: 30 });
      expect(await getBalance(account.id)).toBe(70);
    });
  });

  describe('updateTransaction', () => {
    it('adjusts the balance when the amount changes', async () => {
      const account = await createTestAccount(userId, 100);
      const transaction = await createTransaction(userId, { accountId: account.id, type: 'expense', amount: 30 });
      expect(await getBalance(account.id)).toBe(70);

      await updateTransaction(userId, transaction!.id, { amount: 50 });
      expect(await getBalance(account.id)).toBe(50);
    });

    it('flips the balance effect when the type changes', async () => {
      const account = await createTestAccount(userId, 100);
      const transaction = await createTransaction(userId, { accountId: account.id, type: 'expense', amount: 30 });
      expect(await getBalance(account.id)).toBe(70);

      await updateTransaction(userId, transaction!.id, { type: 'income' });
      expect(await getBalance(account.id)).toBe(130);
    });

    it('moves the balance effect to another account when the account changes', async () => {
      const fromAccount = await createTestAccount(userId, 100);
      const toAccount = await createTestAccount(userId, 100);
      const transaction = await createTransaction(userId, { accountId: fromAccount.id, type: 'expense', amount: 30 });
      expect(await getBalance(fromAccount.id)).toBe(70);
      expect(await getBalance(toAccount.id)).toBe(100);

      await updateTransaction(userId, transaction!.id, { accountId: toAccount.id });
      expect(await getBalance(fromAccount.id)).toBe(100);
      expect(await getBalance(toAccount.id)).toBe(70);
    });

    it('rejects editing a transfer leg directly', async () => {
      const account = await createTestAccount(userId, 100);
      const category = await createTestCategory(userId);
      const transaction = await createTransaction(userId, {
        accountId: account.id,
        categoryId: category.id,
        type: 'expense',
        amount: 10,
      });
      // Simulate a transfer leg by tagging the row directly, matching how transfers.service creates them.
      const { transactions } = await import('../../db/schema.js');
      await db.update(transactions).set({ transferGroupId: crypto.randomUUID() }).where(eq(transactions.id, transaction!.id));

      await expect(updateTransaction(userId, transaction!.id, { amount: 20 })).rejects.toThrow(ConflictError);
    });
  });

  describe('deleteTransaction', () => {
    it('reverses the balance effect of an income transaction', async () => {
      const account = await createTestAccount(userId, 100);
      const transaction = await createTransaction(userId, { accountId: account.id, type: 'income', amount: 40 });
      expect(await getBalance(account.id)).toBe(140);

      await deleteTransaction(userId, transaction!.id);
      expect(await getBalance(account.id)).toBe(100);
    });

    it('reverses the balance effect of an expense transaction', async () => {
      const account = await createTestAccount(userId, 100);
      const transaction = await createTransaction(userId, { accountId: account.id, type: 'expense', amount: 40 });
      expect(await getBalance(account.id)).toBe(60);

      await deleteTransaction(userId, transaction!.id);
      expect(await getBalance(account.id)).toBe(100);
    });
  });

  describe('summaries', () => {
    it('excludes transfer legs from income, expense and category totals', async () => {
      const salary = await createTestAccount(userId, 0);
      const savings = await createTestAccount(userId, 0);
      await createTransaction(userId, { accountId: salary.id, type: 'income', amount: 19000 });
      await createTransfer(userId, { fromAccountId: salary.id, toAccountId: savings.id, amount: 3000 });

      expect(await getTransactionsSummary(userId, {})).toEqual({ income: 19000, expense: 0, net: 19000 });
      const byCategory = await getTransactionsByCategory(userId, {});
      expect(byCategory.reduce((sum, row) => sum + row.total, 0)).toBe(19000);
    });
  });
});
