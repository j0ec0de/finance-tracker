import { useState, type FormEvent } from "react"

import { useUpdateAccount } from "@/hooks/use-accounts"
import { ApiError } from "@/lib/api"
import type { Account, AccountType } from "@/lib/accounts"

export function useEditAccountForm(account: Account, onSuccess: () => void) {
  const updateAccount = useUpdateAccount()

  const [name, setName] = useState(account.name)
  const [type, setType] = useState<AccountType>(account.type)
  const [currency, setCurrency] = useState(account.currency)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("Name is required.")
      return
    }

    try {
      await updateAccount.mutateAsync({
        id: account.id,
        input: { name: name.trim(), type, currency },
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
    type,
    setType,
    currency,
    setCurrency,
    error,
    isSubmitting: updateAccount.isPending,
    handleSubmit,
  }
}
