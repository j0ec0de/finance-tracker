import { useState, type FormEvent } from "react"

import { useCreateTransfer } from "@/hooks/use-transfers"
import { ApiError } from "@/lib/api"

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function useCreateTransferForm(
  defaultFromAccountId: number | undefined,
  onSuccess: () => void
) {
  const createTransfer = useCreateTransfer()

  const [fromAccountId, setFromAccountId] = useState(
    defaultFromAccountId ? String(defaultFromAccountId) : ""
  )
  const [toAccountId, setToAccountId] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [occurredAt, setOccurredAt] = useState(today())
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const parsedAmount = Number(amount)
    if (!fromAccountId || !toAccountId) {
      setError("Both accounts are required.")
      return
    }
    if (fromAccountId === toAccountId) {
      setError("Choose two different accounts.")
      return
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be a positive number.")
      return
    }

    try {
      await createTransfer.mutateAsync({
        fromAccountId: Number(fromAccountId),
        toAccountId: Number(toAccountId),
        amount: parsedAmount,
        description: description.trim() || undefined,
        occurredAt,
      })
      setFromAccountId(defaultFromAccountId ? String(defaultFromAccountId) : "")
      setToAccountId("")
      setAmount("")
      setDescription("")
      setOccurredAt(today())
      onSuccess()
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      )
    }
  }

  return {
    fromAccountId,
    setFromAccountId,
    toAccountId,
    setToAccountId,
    amount,
    setAmount,
    description,
    setDescription,
    occurredAt,
    setOccurredAt,
    error,
    isSubmitting: createTransfer.isPending,
    handleSubmit,
  }
}
