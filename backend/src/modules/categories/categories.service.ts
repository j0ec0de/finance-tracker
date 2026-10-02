import { and, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { categories } from '../../db/schema.js';
import { NotFoundError } from '../../utils/app-error.js';
import type { CreateCategoryInput, UpdateCategoryInput } from './categories.schema.js';

export const listCategories = async (filters: {
  userId?: number | undefined;
  type?: 'expense' | 'income' | undefined;
}) => {
  const conditions = [];
  if (filters.userId !== undefined) conditions.push(eq(categories.userId, filters.userId));
  if (filters.type !== undefined) conditions.push(eq(categories.type, filters.type));

  if (conditions.length === 0) return db.select().from(categories);
  return db.select().from(categories).where(and(...conditions));
};

export const getCategoryById = async (id: number) => {
  const [category] = await db.select().from(categories).where(eq(categories.id, id));
  if (!category) throw new NotFoundError('Category');
  return category;
};

export const createCategory = async (input: CreateCategoryInput) => {
  const [category] = await db.insert(categories).values(input).returning();
  return category;
};

export const updateCategory = async (id: number, input: UpdateCategoryInput) => {
  const [category] = await db.update(categories).set(input).where(eq(categories.id, id)).returning();
  if (!category) throw new NotFoundError('Category');
  return category;
};

export const deleteCategory = async (id: number) => {
  const [category] = await db.delete(categories).where(eq(categories.id, id)).returning();
  if (!category) throw new NotFoundError('Category');
};
