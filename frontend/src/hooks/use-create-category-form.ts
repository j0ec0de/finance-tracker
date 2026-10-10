import { useState, type FormEvent } from "react"

import { useCreateCategory } from "@/hooks/use-categories"
import { ApiError } from "@/lib/api"
import type { CategoryType } from "@/lib/categories"

export function useCreateCategoryForm(onSuccess: () => void) {
  const createCategory = useCreateCategory()

  const [name, setName] = useState("")
  const [type, setType] = useState<CategoryType>("expense")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("Name is required.")
      return
    }

    try {
      await createCategory.mutateAsync({ name: name.trim(), type })
      setName("")
      setType("expense")
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
    error,
    isSubmitting: createCategory.isPending,
    handleSubmit,
  }
}
