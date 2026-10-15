import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTransactionsSummary } from "@/hooks/use-transactions"
import { ApiError } from "@/lib/api"
import { getLastNMonthsRange } from "@/lib/date-range"
import { calcDeltaPct } from "@/lib/format"
import { StatTile } from "@/pages/dashboard/stat-tile"

type SummaryStatsCardProps = {
  months: number
}

export function SummaryStatsCard({ months }: SummaryStatsCardProps) {
  const { data: current, isLoading: currentLoading, isError, error } =
    useTransactionsSummary(getLastNMonthsRange(months))
  const { data: previous, isLoading: previousLoading } = useTransactionsSummary(
    getLastNMonthsRange(months, months)
  )

  const isLoading = currentLoading || previousLoading

  return (
    <Card>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-destructive">
            {error instanceof ApiError
              ? error.message
              : "Couldn't load summary totals."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatTile
              label="Total income"
              value={current?.income ?? 0}
              deltaPct={calcDeltaPct(current?.income ?? 0, previous?.income ?? 0)}
              comparisonLabel="vs prior period"
            />
            <StatTile
              label="Total expenses"
              value={current?.expense ?? 0}
              deltaPct={calcDeltaPct(current?.expense ?? 0, previous?.expense ?? 0)}
              comparisonLabel="vs prior period"
            />
            <StatTile
              label="Net"
              value={current?.net ?? 0}
              deltaPct={calcDeltaPct(current?.net ?? 0, previous?.net ?? 0)}
              comparisonLabel="vs prior period"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
