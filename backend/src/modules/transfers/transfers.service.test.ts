import { eq } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../db/index.js';
import { accounts, transactions } from '../../db/schema.js';
import { createTestAccount, createTestUser, deleteTestUser } from '../../test/helpers.js';
import { deleteTransaction } from '../transactions/transactions.service.js';
import { createTransfer } from './transfers.service.js';

const getBalance = async (accountId: number) => {
  const [account] = await db.select().from(accounts).where(eq(accounts.id, accountId));
  return Number(account?.balance);
};

describe('transfer balance logic', () => {
  let userId: number;

  beforeEach(async () => {
    const user = await createTestUser();
    userId = user.id;
  });

  afterEach(async () => {
    await deleteTestUser(userId);
  });

  it('moves the amount from the source account to the destination account', async () => {
    const fromAccount = await createTestAccount(userId, 100);
    const toAccount = await createTestAccount(userId, 50);

    const { outgoing, incoming } = await createTransfer(userId, {
      fromAccountId: fromAccount.id,
      toAccountId: toAccount.id,
      amount: 30,
    });

    expect(await getBalance(fromAccount.id)).toBe(70);
    expect(await getBalance(toAccount.id)).toBe(80);
    expect(outgoing!.transferGroupId).toBe(incoming!.transferGroupId);
  });

  it('reverses both legs atomically on delete', async () => {
    const fromAccount = await createTestAccount(userId, 100);
    const toAccount = await createTestAccount(userId, 50);

    const { outgoing } = await createTransfer(userId, {
      fromAccountId: fromAccount.id,
      toAccountId: toAccount.id,
      amount: 30,
    });

    await deleteTransaction(userId, outgoing!.id);

    expect(await getBalance(fromAccount.id)).toBe(100);
    expect(await getBalance(toAccount.id)).toBe(50);

    const remaining = await db
      .select()
      .from(transactions)
      .where(eq(transactions.transferGroupId, outgoing!.transferGroupId!));
    expect(remaining).toHaveLength(0);
  });
});
