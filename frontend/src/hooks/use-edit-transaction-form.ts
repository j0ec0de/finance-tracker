import { useState, type FormEvent } from "react"

import { useUpdateTransaction } from "@/hooks/use-transactions"
import { ApiError } from "@/lib/api"
import type { Transaction, TransactionType } from "@/lib/transactions"

export function useEditTransactionForm(
  transaction: Transaction,
  onSuccess: () => void
) {
  const updateTransaction = useUpdateTransaction()

  const [accountId, setAccountId] = useState(String(transaction.accountId))
  const [categoryId, setCategoryId] = useState(
    transaction.categoryId ? String(transaction.categoryId) : "none"
  )
  const [type, setType] = useState<TransactionType>(transaction.type)
  const [amount, setAmount] = useState(transaction.amount)
  const [description, setDescription] = useState(transaction.description ?? "")
  const [occurredAt, setOccurredAt] = useState(
    transaction.occurredAt.slice(0, 10)
  )
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const parsedAmount = Number(amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be a positive number.")
      return
    }

    try {
      await updateTransaction.mutateAsync({
        id: transaction.id,
        input: {
          accountId: Number(accountId),
          categoryId: categoryId === "none" ? undefined : Number(categoryId),
          type,
          amount: parsedAmount,
          description: description.trim() || undefined,
          occurredAt,
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
    isSubmitting: updateTransaction.isPending,
    handleSubmit,
  }
}
