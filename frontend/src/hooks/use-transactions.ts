import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { accountsKey } from "@/hooks/use-accounts"
import { useAuth } from "@/hooks/use-auth"
import * as transactionsApi from "@/lib/transactions"
import type {
  CreateTransactionInput,
  ListTransactionsParams,
  UpdateTransactionInput,
} from "@/lib/transactions"

const transactionsKey = (params: ListTransactionsParams) =>
  ["transactions", params] as const

export function useTransactions(params: ListTransactionsParams) {
  const { token } = useAuth()

  return useQuery({
    queryKey: transactionsKey(params),
    queryFn: () => transactionsApi.listTransactions(token!, params),
    enabled: !!token,
  })
}

function useInvalidateOnMutate() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] })
    queryClient.invalidateQueries({ queryKey: accountsKey })
  }
}

export function useCreateTransaction() {
  const { token } = useAuth()
  const invalidate = useInvalidateOnMutate()

  return useMutation({
    mutationFn: (input: CreateTransactionInput) =>
      transactionsApi.createTransaction(token!, input),
    onSuccess: invalidate,
  })
}

export function useUpdateTransaction() {
  const { token } = useAuth()
  const invalidate = useInvalidateOnMutate()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTransactionInput }) =>
      transactionsApi.updateTransaction(token!, id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteTransaction() {
  const { token } = useAuth()
  const invalidate = useInvalidateOnMutate()

  return useMutation({
    mutationFn: (id: number) => transactionsApi.deleteTransaction(token!, id),
    onSuccess: invalidate,
  })
}
