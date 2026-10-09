import { useState, type FormEvent } from "react"

import { useCreateAccount } from "@/hooks/use-accounts"
import { ApiError } from "@/lib/api"
import type { AccountType } from "@/lib/accounts"

export function useCreateAccountForm(onSuccess: () => void) {
  const createAccount = useCreateAccount()

  const [name, setName] = useState("")
  const [type, setType] = useState<AccountType>("cash")
  const [balance, setBalance] = useState("0")
  const [currency, setCurrency] = useState("USD")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const parsedBalance = Number(balance)
    if (!name.trim()) {
      setError("Name is required.")
      return
    }
    if (!Number.isFinite(parsedBalance)) {
      setError("Starting balance must be a number.")
      return
    }

    try {
      await createAccount.mutateAsync({
        name: name.trim(),
        type,
        balance: parsedBalance,
        currency,
      })
      setName("")
      setType("cash")
      setBalance("0")
      setCurrency("USD")
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
    type,
    setType,
    balance,
    setBalance,
    currency,
    setCurrency,
    error,
    isSubmitting: createAccount.isPending,
    handleSubmit,
  }
}
