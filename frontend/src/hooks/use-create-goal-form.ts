import { useState, type FormEvent } from "react"

import { useCreateGoal } from "@/hooks/use-goals"
import { ApiError } from "@/lib/api"

export function useCreateGoalForm(onSuccess: () => void) {
  const createGoal = useCreateGoal()

  const [name, setName] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [savedAmount, setSavedAmount] = useState("")
  const [targetDate, setTargetDate] = useState("")
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

    const saved = savedAmount ? Number(savedAmount) : 0
    if (!Number.isFinite(saved) || saved < 0) {
      setError("Saved so far can't be negative.")
      return
    }

    try {
      await createGoal.mutateAsync({
        name: name.trim(),
        targetAmount: target,
        savedAmount: saved,
        targetDate: targetDate || undefined,
      })
      setName("")
      setTargetAmount("")
      setSavedAmount("")
      setTargetDate("")
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
    isSubmitting: createGoal.isPending,
    handleSubmit,
  }
}
