import { useState, type FormEvent } from "react"

import { useUpdateBudget } from "@/hooks/use-budgets"
import { ApiError } from "@/lib/api"
import type { Budget, BudgetPeriod } from "@/lib/budgets"

export function useEditBudgetForm(budget: Budget, onSuccess: () => void) {
  const updateBudget = useUpdateBudget()

  const [limit, setLimit] = useState(budget.limit)
  const [period, setPeriod] = useState<BudgetPeriod>(budget.period)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const limitValue = Number(limit)
    if (!limit || !Number.isFinite(limitValue) || limitValue <= 0) {
      setError("Enter a limit greater than 0.")
      return
    }

    try {
      await updateBudget.mutateAsync({
        id: budget.id,
        input: { limit: limitValue, period },
      })
      onSuccess()
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      )
    }
  }

  return {
    limit,
    setLimit,
    period,
    setPeriod,
    error,
    isSubmitting: updateBudget.isPending,
    handleSubmit,
  }
}
