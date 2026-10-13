import { useState, type FormEvent } from "react"

import { useCreateBudget } from "@/hooks/use-budgets"
import { ApiError } from "@/lib/api"
import type { BudgetPeriod } from "@/lib/budgets"

export function useCreateBudgetForm(onSuccess: () => void) {
  const createBudget = useCreateBudget()

  const [categoryId, setCategoryId] = useState("")
  const [limit, setLimit] = useState("")
  const [period, setPeriod] = useState<BudgetPeriod>("monthly")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!categoryId) {
      setError("Category is required.")
      return
    }

    const limitValue = Number(limit)
    if (!limit || !Number.isFinite(limitValue) || limitValue <= 0) {
      setError("Enter a limit greater than 0.")
      return
    }

    try {
      await createBudget.mutateAsync({
        categoryId: Number(categoryId),
        limit: limitValue,
        period,
      })
      setCategoryId("")
      setLimit("")
      setPeriod("monthly")
      onSuccess()
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      )
    }
  }

  return {
    categoryId,
    setCategoryId,
    limit,
    setLimit,
    period,
    setPeriod,
    error,
    isSubmitting: createBudget.isPending,
    handleSubmit,
  }
}
