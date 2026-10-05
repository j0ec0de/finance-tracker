import { and, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import type { Executor } from '../../db/executor.js';
import { categories } from '../../db/schema.js';
import { NotFoundError } from '../../utils/app-error.js';
import type {
  CreateCategoryInput,
  ListCategoriesQuery,
  UpdateCategoryInput,
} from './categories.schema.js';

export const listCategories = async (userId: number, filters: ListCategoriesQuery) => {
  const conditions = [eq(categories.userId, userId)];
  if (filters.type !== undefined) conditions.push(eq(categories.type, filters.type));

  return db.select().from(categories).where(and(...conditions));
};

export const getCategoryById = async (userId: number, id: number) => {
  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, userId)));
  if (!category) throw new NotFoundError('Category');
  return category;
};

export const createCategory = async (userId: number, input: CreateCategoryInput) => {
  const [category] = await db
    .insert(categories)
    .values({ ...input, userId })
    .returning();
  return category;
};

export const updateCategory = async (userId: number, id: number, input: UpdateCategoryInput) => {
  const [category] = await db
    .update(categories)
    .set(input)
    .where(and(eq(categories.id, id), eq(categories.userId, userId)))
    .returning();
  if (!category) throw new NotFoundError('Category');
  return category;
};

export const deleteCategory = async (userId: number, id: number) => {
  const [category] = await db
    .delete(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, userId)))
    .returning();
  if (!category) throw new NotFoundError('Category');
};

/** Throws NotFoundError unless the category exists and belongs to the user. */
export const assertCategoryOwned = async (executor: Executor, userId: number, categoryId: number) => {
  const [category] = await executor
    .select({ id: categories.id })
    .from(categories)
    .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)));
  if (!category) throw new NotFoundError('Category');
};
