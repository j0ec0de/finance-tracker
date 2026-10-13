import { and, asc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { goals } from '../../db/schema.js';
import { NotFoundError } from '../../utils/app-error.js';
import type { CreateGoalInput, UpdateGoalInput } from './goals.schema.js';

export const listGoals = async (userId: number) =>
  db
    .select()
    .from(goals)
    .where(eq(goals.userId, userId))
    .orderBy(asc(goals.createdAt), asc(goals.id));

export const getGoalById = async (userId: number, id: number) => {
  const [goal] = await db
    .select()
    .from(goals)
    .where(and(eq(goals.id, id), eq(goals.userId, userId)));
  if (!goal) throw new NotFoundError('Goal');
  return goal;
};

export const createGoal = async (userId: number, input: CreateGoalInput) => {
  const [goal] = await db
    .insert(goals)
    .values({
      ...input,
      userId,
      // `numeric` columns are written as strings.
      targetAmount: input.targetAmount.toFixed(2),
      savedAmount: input.savedAmount.toFixed(2),
    })
    .returning();
  return goal;
};

export const updateGoal = async (userId: number, id: number, input: UpdateGoalInput) => {
  const [goal] = await db
    .update(goals)
    .set({
      ...input,
      targetAmount: input.targetAmount?.toFixed(2),
      savedAmount: input.savedAmount?.toFixed(2),
    })
    .where(and(eq(goals.id, id), eq(goals.userId, userId)))
    .returning();
  if (!goal) throw new NotFoundError('Goal');
  return goal;
};

export const deleteGoal = async (userId: number, id: number) => {
  const [goal] = await db
    .delete(goals)
    .where(and(eq(goals.id, id), eq(goals.userId, userId)))
    .returning();
  if (!goal) throw new NotFoundError('Goal');
};
