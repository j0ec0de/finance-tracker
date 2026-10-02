import { relations } from 'drizzle-orm';
import { integer, numeric, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const transactionTypeEnum = pgEnum('transaction_type', ['expense', 'income']);
export const accountTypeEnum = pgEnum('account_type', ['cash', 'bank', 'credit_card', 'wallet', 'investment', 'other']);

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  email: text().notNull().unique(),
  passwordHash: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const accounts = pgTable('accounts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  type: accountTypeEnum().notNull().default('cash'),
  balance: numeric({ precision: 12, scale: 2 }).notNull().default('0'),
  currency: text().notNull().default('USD'),
  createdAt: timestamp().notNull().defaultNow(),
});

export const categories = pgTable('categories', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  type: transactionTypeEnum().notNull().default('expense'),
  icon: text(),
  color: text(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: integer().notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  categoryId: integer().references(() => categories.id, { onDelete: 'set null' }),
  type: transactionTypeEnum().notNull(),
  amount: numeric({ precision: 12, scale: 2 }).notNull(),
  description: text(),
  occurredAt: timestamp().notNull().defaultNow(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  categories: many(categories),
  transactions: many(transactions),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
  transactions: many(transactions),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, { fields: [categories.userId], references: [users.id] }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  account: one(accounts, { fields: [transactions.accountId], references: [accounts.id] }),
  category: one(categories, { fields: [transactions.categoryId], references: [categories.id] }),
}));
