import { useState, type FormEvent } from "react"

import { useCreateTransaction } from "@/hooks/use-transactions"
import { ApiError } from "@/lib/api"
import type { TransactionType } from "@/lib/transactions"

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function useCreateTransactionForm(
  defaultAccountId: number | undefined,
  onSuccess: () => void
) {
  const createTransaction = useCreateTransaction()

  const [accountId, setAccountId] = useState(
    defaultAccountId ? String(defaultAccountId) : ""
  )
  const [categoryId, setCategoryId] = useState("none")
  const [type, setType] = useState<TransactionType>("expense")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [occurredAt, setOccurredAt] = useState(today())
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const parsedAmount = Number(amount)
    if (!accountId) {
      setError("Account is required.")
      return
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be a positive number.")
      return
    }

    try {
      await createTransaction.mutateAsync({
        accountId: Number(accountId),
        categoryId: categoryId === "none" ? undefined : Number(categoryId),
        type,
        amount: parsedAmount,
        description: description.trim() || undefined,
        occurredAt,
      })
      setAccountId(defaultAccountId ? String(defaultAccountId) : "")
      setCategoryId("none")
      setType("expense")
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
    accountId,
    setAccountId,
    categoryId,
    setCategoryId,
    type,
    setType,
    amount,
    setAmount,
    description,
    setDescription,
    occurredAt,
    setOccurredAt,
    error,
    isSubmitting: createTransaction.isPending,
    handleSubmit,
  }
}
