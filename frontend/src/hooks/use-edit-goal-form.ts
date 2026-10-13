import { useState, type FormEvent } from "react"

import { useUpdateGoal } from "@/hooks/use-goals"
import { ApiError } from "@/lib/api"
import type { Goal } from "@/lib/goals"

export function useEditGoalForm(goal: Goal, onSuccess: () => void) {
  const updateGoal = useUpdateGoal()

  const [name, setName] = useState(goal.name)
  const [targetAmount, setTargetAmount] = useState(goal.targetAmount)
  const [savedAmount, setSavedAmount] = useState(goal.savedAmount)
  const [targetDate, setTargetDate] = useState(
    goal.targetDate ? goal.targetDate.slice(0, 10) : ""
  )
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("Name is required.")
      return
    }

    const target = Number(targetAmount)
    if (!targetAmount || !Number.isFinite(target) || target <= 0) {
      setError("Enter a target amount greater than 0.")
      return
    }

    const saved = Number(savedAmount)
    if (!Number.isFinite(saved) || saved < 0) {
      setError("Saved so far can't be negative.")
      return
    }

    try {
      await updateGoal.mutateAsync({
        id: goal.id,
        input: {
          name: name.trim(),
          targetAmount: target,
          savedAmount: saved,
          targetDate: targetDate || null,
        },
      })
      onSuccess()
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      )
    }
  }

  return {
    name,
    setName,
    targetAmount,
    setTargetAmount,
    savedAmount,
    setSavedAmount,
    targetDate,
    setTargetDate,
    error,
    isSubmitting: updateGoal.isPending,
    handleSubmit,
  }
}
