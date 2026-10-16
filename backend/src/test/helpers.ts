import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { accounts, categories, users } from '../db/schema.js';

let counter = 0;

/** Creates a throwaway user for a test. Deleting it cascades to its accounts/categories/transactions. */
export const createTestUser = async () => {
  counter += 1;
  const [user] = await db
    .insert(users)
    .values({
      name: 'Test User',
      email: `balance-test-${Date.now()}-${counter}@example.com`,
      passwordHash: 'not-a-real-hash',
    })
    .returning();
  if (!user) throw new Error('failed to create test user');
  return user;
};

export const deleteTestUser = async (userId: number) => {
  await db.delete(users).where(eq(users.id, userId));
};

export const createTestAccount = async (userId: number, balance = 0) => {
  const [account] = await db
    .insert(accounts)
    .values({ userId, name: 'Test Account', balance: balance.toFixed(2) })
    .returning();
  if (!account) throw new Error('failed to create test account');
  return account;
};

export const createTestCategory = async (userId: number, type: 'expense' | 'income' = 'expense') => {
  const [category] = await db
    .insert(categories)
    .values({ userId, name: 'Test Category', type })
    .returning();
  if (!category) throw new Error('failed to create test category');
  return category;
};
