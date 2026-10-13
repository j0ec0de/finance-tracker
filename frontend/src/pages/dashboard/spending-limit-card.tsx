import { useBudgets } from "@/hooks/use-budgets"
import { ApiError } from "@/lib/api"
import { formatCurrency } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Meter } from "@/pages/dashboard/meter"

export function SpendingLimitCard() {
  const { data: budgets, isLoading, isError, error } = useBudgets()

  const monthlyBudgets = (budgets ?? []).filter((b) => b.period === "monthly")
  const spent = monthlyBudgets.reduce((sum, b) => sum + b.spent, 0)
  const limit = monthlyBudgets.reduce((sum, b) => sum + Number(b.limit), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Monthly spending limit
        </CardTitle>
        <p className="text-sm text-muted-foreground">Across budgeted categories</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <Skeleton className="h-2.5 w-full" />
        ) : isError ? (
          <p className="text-sm text-destructive">
            {error instanceof ApiError
              ? error.message
              : "Couldn't load budgets."}
          </p>
        ) : limit > 0 ? (
          <>
            <Meter value={spent} max={limit} />
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{formatCurrency(spent)}</span>
              <span className="text-muted-foreground">{formatCurrency(limit)}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No monthly budgets set yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
