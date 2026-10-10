import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/hooks/use-auth"
import * as categoriesApi from "@/lib/categories"
import type { CreateCategoryInput } from "@/lib/categories"

export const categoriesKey = ["categories"] as const

export function useCategories() {
  const { token } = useAuth()

  return useQuery({
    queryKey: categoriesKey,
    queryFn: () => categoriesApi.listCategories(token!),
    enabled: !!token,
  })
}

export function useCreateCategory() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateCategoryInput) =>
      categoriesApi.createCategory(token!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKey })
    },
  })
}
