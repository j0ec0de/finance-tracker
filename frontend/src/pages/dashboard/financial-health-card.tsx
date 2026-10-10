import { useTransactionsSummary } from "@/hooks/use-transactions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api"
import { getMonthRange } from "@/lib/date-range"
import { calcDeltaPct, formatCurrency } from "@/lib/format"

const RADIUS = 54
const STROKE = 10
const CIRCUMFERENCE = Math.PI * RADIUS

export function FinancialHealthCard() {
  const { data: currentMonth, isLoading: currentLoading, isError, error } =
    useTransactionsSummary(getMonthRange(0))
  const { data: previousMonth, isLoading: previousLoading } =
    useTransactionsSummary(getMonthRange(1))

  const isLoading = currentLoading || previousLoading
  const net = currentMonth?.net ?? 0
  const income = currentMonth?.income ?? 0
  const percentSaved = income > 0 ? Math.max(0, Math.min(100, Math.round((net / income) * 100))) : 0
  const deltaPct = calcDeltaPct(net, previousMonth?.net ?? 0)
  const offset = CIRCUMFERENCE - (percentSaved / 100) * CIRCUMFERENCE

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Financial health
        </CardTitle>
        <p className="text-sm text-muted-foreground">Current status</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-1">
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : isError ? (
          <p className="py-8 text-center text-sm text-destructive">
            {error instanceof ApiError
              ? error.message
              : "Couldn't load financial health."}
          </p>
        ) : (
          <>
            <p className="self-start text-2xl font-semibold">
              {formatCurrency(net)}
            </p>
            <p
              className={
                deltaPct >= 0
                  ? "self-start text-xs font-medium text-[var(--status-good)]"
                  : "self-start text-xs font-medium text-[var(--status-critical)]"
              }
            >
              {deltaPct >= 0 ? "+" : ""}
              {deltaPct.toFixed(1)}% from last month
            </p>

            <svg
              viewBox="0 0 120 68"
              className="mt-2 w-full max-w-[180px]"
              role="img"
              aria-label={`${percentSaved}% of monthly income saved`}
            >
              <path
                d="M 6 60 A 54 54 0 0 1 114 60"
                fill="none"
                stroke="color-mix(in oklch, var(--chart-1) 16%, var(--background))"
                strokeWidth={STROKE}
                strokeLinecap="round"
              />
              <path
                d="M 6 60 A 54 54 0 0 1 114 60"
                fill="none"
                stroke="var(--chart-1)"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
              />
              <text
                x="60"
                y="56"
                textAnchor="middle"
                className="fill-foreground text-[20px] font-semibold"
              >
                {percentSaved}%
              </text>
            </svg>
            <p className="text-center text-xs text-muted-foreground">
              Of this month's income saved
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
