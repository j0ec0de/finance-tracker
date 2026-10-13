import { and, eq, gte, lt, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { budgets, transactions } from '../../db/schema.js';
import { assertCategoryOwned } from '../categories/categories.service.js';
import { ConflictError, NotFoundError } from '../../utils/app-error.js';
import type { BudgetPeriod, CreateBudgetInput, UpdateBudgetInput } from './budgets.schema.js';

/** Start (inclusive) and end (exclusive) of the period containing `now`. */
const currentPeriodRange = (period: BudgetPeriod, now = new Date()) => {
  if (period === 'weekly') {
    // Week starts Monday.
    const start = new Date(now);
    const day = (start.getDay() + 6) % 7;
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - day);

    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return { start, end };
  }

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start, end };
};

const getSpent = async (userId: number, categoryId: number, period: BudgetPeriod) => {
  const { start, end } = currentPeriodRange(period);

  const [row] = await db
    .select({ spent: sql<string>`coalesce(sum(${transactions.amount}), 0)` })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.categoryId, categoryId),
        eq(transactions.type, 'expense'),
        gte(transactions.occurredAt, start),
        lt(transactions.occurredAt, end),
      ),
    );

  return Number(row?.spent ?? 0);
};

const withSpent = async <T extends { categoryId: number; period: BudgetPeriod; limit: string }>(
  userId: number,
  budget: T,
) => {
  const spent = await getSpent(userId, budget.categoryId, budget.period);
  return { ...budget, spent, remaining: Number(budget.limit) - spent };
};

export const listBudgets = async (userId: number) => {
  const rows = await db.select().from(budgets).where(eq(budgets.userId, userId));
  return Promise.all(rows.map((budget) => withSpent(userId, budget)));
};

export const getBudgetById = async (userId: number, id: number) => {
  const [budget] = await db
    .select()
    .from(budgets)
    .where(and(eq(budgets.id, id), eq(budgets.userId, userId)));
  if (!budget) throw new NotFoundError('Budget');
  return withSpent(userId, budget);
};

export const createBudget = async (userId: number, input: CreateBudgetInput) => {
  await assertCategoryOwned(db, userId, input.categoryId);

  const [existing] = await db
    .select({ id: budgets.id })
    .from(budgets)
    .where(and(eq(budgets.userId, userId), eq(budgets.categoryId, input.categoryId)));
  if (existing) throw new ConflictError('A budget already exists for this category');

  const [budget] = await db
    .insert(budgets)
    .values({ ...input, userId, limit: input.limit.toFixed(2) })
    .returning();
  return withSpent(userId, budget!);
};

export const updateBudget = async (userId: number, id: number, input: UpdateBudgetInput) => {
  if (input.categoryId !== undefined) await assertCategoryOwned(db, userId, input.categoryId);

  const [budget] = await db
    .update(budgets)
    .set({ ...input, limit: input.limit?.toFixed(2) })
    .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
    .returning();
  if (!budget) throw new NotFoundError('Budget');
  return withSpent(userId, budget);
};

export const deleteBudget = async (userId: number, id: number) => {
  const [budget] = await db
    .delete(budgets)
    .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
    .returning();
  if (!budget) throw new NotFoundError('Budget');
};
