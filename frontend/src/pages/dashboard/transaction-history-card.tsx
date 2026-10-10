import { useTransactions } from "@/hooks/use-transactions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

export function TransactionHistoryCard() {
  const { data, isLoading, isError, error } = useTransactions({ limit: 6 })
  const transactions = data?.data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Transaction history
        </CardTitle>
        <p className="text-sm text-muted-foreground">Most recent</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-destructive">
            {error instanceof ApiError
              ? error.message
              : "Couldn't load transactions."}
          </p>
        ) : transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No transactions yet.
          </p>
        ) : (
          <ul className="divide-y">
            {transactions.map((transaction) => {
              const isIncome = transaction.type === "income"

              return (
                <li
                  key={transaction.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {transaction.description || (isIncome ? "Income" : "Expense")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.occurredAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-sm font-medium tabular-nums",
                      isIncome ? "text-[var(--status-good)]" : "text-foreground"
                    )}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(Number(transaction.amount))}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
