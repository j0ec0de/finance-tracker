import type { Budget } from "@/lib/budgets"

export type PlannedExpense = {
  id: string
  name: string
  amount: number
  categoryId: number | null
}

export type BudgetImpact = {
  budgetId: number
  categoryId: number
  limit: number
  spent: number
  planned: number
  projected: number
  overBy: number
}

export function sumPlanned(items: PlannedExpense[]) {
  return items.reduce((sum, item) => sum + item.amount, 0)
}

/** How the planned items would move each budget, for budgets they touch. */
export function computeBudgetImpacts(
  budgets: Budget[],
  items: PlannedExpense[]
): BudgetImpact[] {
  return budgets.flatMap((budget) => {
    const planned = sumPlanned(
      items.filter((item) => item.categoryId === budget.categoryId)
    )
    if (planned === 0) return []

    const limit = Number(budget.limit)
    const projected = budget.spent + planned
    return [
      {
        budgetId: budget.id,
        categoryId: budget.categoryId,
        limit,
        spent: budget.spent,
        planned,
        projected,
        overBy: Math.max(0, projected - limit),
      },
    ]
  })
}
