import { useTransactionsByCategory } from "@/hooks/use-transactions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api"
import { getMonthRange } from "@/lib/date-range"
import { formatCurrency } from "@/lib/format"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
]

export function CostAnalysisCard() {
  const { data, isLoading, isError, error } = useTransactionsByCategory(
    getMonthRange(0)
  )

  const expenseCategories = (data?.data ?? [])
    .filter((c) => c.type === "expense")
    .sort((a, b) => b.total - a.total)

  const total = expenseCategories.reduce((sum, c) => sum + c.total, 0)
  const categories = expenseCategories.map((c, i) => ({
    ...c,
    pct: total > 0 ? Math.round((c.total / total) * 100) : 0,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Cost analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Spending this month</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-2.5 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-destructive">
            {error instanceof ApiError
              ? error.message
              : "Couldn't load spending data."}
          </p>
        ) : categories.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No expenses yet this month.
          </p>
        ) : (
          <>
            <p className="text-2xl font-semibold">{formatCurrency(total)}</p>

            <div
              className="flex h-2.5 w-full overflow-hidden rounded-full"
              role="img"
              aria-label="Spending breakdown by category"
            >
              {categories.map((category) => (
                <div
                  key={category.categoryId ?? "uncategorized"}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{
                    width: `${category.pct}%`,
                    backgroundColor: category.color,
                    marginRight: "2px",
                  }}
                />
              ))}
            </div>

            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category.categoryId ?? "uncategorized"}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: category.color }}
                      aria-hidden
                    />
                    <span className="text-foreground">
                      {category.categoryName}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    {category.pct}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
