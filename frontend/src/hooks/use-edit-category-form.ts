import { useState, type FormEvent } from "react"

import { useUpdateCategory } from "@/hooks/use-categories"
import { ApiError } from "@/lib/api"
import type { Category, CategoryType } from "@/lib/categories"

export function useEditCategoryForm(category: Category, onSuccess: () => void) {
  const updateCategory = useUpdateCategory()

  const [name, setName] = useState(category.name)
  const [type, setType] = useState<CategoryType>(category.type)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("Name is required.")
      return
    }

    try {
      await updateCategory.mutateAsync({
        id: category.id,
        input: { name: name.trim(), type },
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
    error,
    isSubmitting: updateCategory.isPending,
    handleSubmit,
  }
}
