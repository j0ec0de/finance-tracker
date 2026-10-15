import { db } from '../../db/index.js';
import { transactions } from '../../db/schema.js';
import { adjustAccountBalance, getOwnedAccount } from '../accounts/accounts.service.js';
import type { CreateTransferInput } from './transfers.schema.js';

export const createTransfer = async (userId: number, input: CreateTransferInput) => {
  return db.transaction(async (tx) => {
    const fromAccount = await getOwnedAccount(tx, userId, input.fromAccountId);
    const toAccount = await getOwnedAccount(tx, userId, input.toAccountId);

    const transferGroupId = crypto.randomUUID();
    const amount = input.amount.toFixed(2);
    const occurredAt = input.occurredAt ?? new Date();

    const [outgoing] = await tx
      .insert(transactions)
      .values({
        userId,
        accountId: fromAccount.id,
        type: 'expense',
        amount,
        description: input.description ?? `Transfer to ${toAccount.name}`,
        occurredAt,
        transferGroupId,
      })
      .returning();

    const [incoming] = await tx
      .insert(transactions)
      .values({
        userId,
        accountId: toAccount.id,
        type: 'income',
        amount,
        description: input.description ?? `Transfer from ${fromAccount.name}`,
        occurredAt,
        transferGroupId,
      })
      .returning();

    await adjustAccountBalance(tx, fromAccount.id, -input.amount);
    await adjustAccountBalance(tx, toAccount.id, input.amount);

    return { outgoing, incoming };
  });
};
