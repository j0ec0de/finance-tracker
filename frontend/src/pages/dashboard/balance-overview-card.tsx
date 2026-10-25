import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { useAccounts } from "@/hooks/use-accounts"
import {
  useTransactions,
  useTransactionsSummary,
  useTransactionsTrend,
} from "@/hooks/use-transactions"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { getLastNDaysRange, getMonthRange } from "@/lib/date-range"
import { useFormatCurrency } from "@/hooks/use-display-currency"
import { calcDeltaPct } from "@/lib/format"
import { StatTile } from "@/pages/dashboard/stat-tile"

const chartConfig = {
  income: { label: "Income", color: "var(--chart-1)" },
  expenses: { label: "Expenses", color: "var(--chart-2)" },
} satisfies ChartConfig

const RANGE_OPTIONS = [
  { value: "7d", label: "Last 7 days", days: 7, months: 0 },
  { value: "30d", label: "Last 30 days", days: 30, months: 0 },
  { value: "6m", label: "Last 6 months", days: 7, months: 6 },
  { value: "12m", label: "Last 12 months", days: 7, months: 12 },
]

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function buildDailyFlow(
  transactions: { type: "income" | "expense"; amount: string; occurredAt: string }[],
  dayCount: number
) {
  const days = Array.from({ length: dayCount }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (dayCount - 1 - i))
    return {
      key: date.toDateString(),
      day:
        dayCount <= 7
          ? WEEKDAY_LABELS[date.getDay()]
          : `${date.getDate()}/${date.getMonth() + 1}`,
      income: 0,
      expenses: 0,
    }
  })

  for (const transaction of transactions) {
    const key = new Date(transaction.occurredAt).toDateString()
    const bucket = days.find((d) => d.key === key)
    if (!bucket) continue
    const amount = Number(transaction.amount)
    if (transaction.type === "income") bucket.income += amount
    else bucket.expenses += amount
  }

  return days
}

export function BalanceOverviewCard() {
  const formatCurrency = useFormatCurrency()
  const { data: accounts, isLoading: accountsLoading } = useAccounts()
  const [range, setRange] = useState("7d")
  const option = RANGE_OPTIONS.find((o) => o.value === range) ?? RANGE_OPTIONS[0]
  const isMonthly = option.months > 0
  const { data: recentTransactions, isLoading: transactionsLoading } =
    useTransactions({ ...getLastNDaysRange(option.days), limit: 200 })
  const trend = useTransactionsTrend(option.months)
  const { data: currentMonth, isLoading: currentLoading } =
    useTransactionsSummary(getMonthRange(0))
  const { data: previousMonth, isLoading: previousLoading } =
    useTransactionsSummary(getMonthRange(1))

  const isLoading =
    accountsLoading ||
    currentLoading ||
    previousLoading ||
    (isMonthly ? trend.isLoading : transactionsLoading)

  const balance = (accounts ?? []).reduce(
    (sum, account) => sum + Number(account.balance),
    0
  )
  const chartData = isMonthly
    ? trend.data.map((point) => ({
        day: point.month,
        income: point.income,
        expenses: point.expense,
      }))
    : buildDailyFlow(recentTransactions?.data ?? [], option.days)
  const net = (currentMonth?.net ?? 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle className="text-base font-medium text-muted-foreground">
            Balance overview
          </CardTitle>
          <p className="text-2xl font-semibold text-foreground">
            {formatCurrency(balance)}
          </p>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger size="sm" aria-label="Chart range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[220px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart data={chartData} barCategoryGap={chartData.length > 7 ? 4 : 24}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                stroke="var(--muted-foreground)"
                fontSize={12}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <>
                        <span className="text-muted-foreground">{name}</span>
                        <span className="ml-auto font-medium text-foreground">
                          {formatCurrency(Number(value))}
                        </span>
                      </>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="income"
                fill="var(--color-income)"
                radius={[4, 4, 0, 0]}
                maxBarSize={18}
              />
              <Bar
                dataKey="expenses"
                fill="var(--color-expenses)"
                radius={[4, 4, 0, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ChartContainer>
        )}
        <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-4">
          <StatTile
            label="Total income"
            value={currentMonth?.income ?? 0}
            deltaPct={calcDeltaPct(
              currentMonth?.income ?? 0,
              previousMonth?.income ?? 0
            )}
          />
          <StatTile
            label="Total expenses"
            value={currentMonth?.expense ?? 0}
            deltaPct={calcDeltaPct(
              currentMonth?.expense ?? 0,
              previousMonth?.expense ?? 0
            )}
          />
          <StatTile
            label="Net this month"
            value={net}
            deltaPct={calcDeltaPct(net, previousMonth?.net ?? 0)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
