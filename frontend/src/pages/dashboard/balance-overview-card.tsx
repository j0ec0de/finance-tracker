import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { useAccounts } from "@/hooks/use-accounts"
import { useTransactions, useTransactionsSummary } from "@/hooks/use-transactions"
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
import { Skeleton } from "@/components/ui/skeleton"
import { getLastNDaysRange, getMonthRange } from "@/lib/date-range"
import { calcDeltaPct, formatCurrency } from "@/lib/format"
import { StatTile } from "@/pages/dashboard/stat-tile"

const chartConfig = {
  income: { label: "Income", color: "var(--chart-1)" },
  expenses: { label: "Expenses", color: "var(--chart-2)" },
} satisfies ChartConfig

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function buildDailyFlow(
  transactions: { type: "income" | "expense"; amount: string; occurredAt: string }[]
) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      key: date.toDateString(),
      day: WEEKDAY_LABELS[date.getDay()],
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
  const { data: accounts, isLoading: accountsLoading } = useAccounts()
  const last7Days = getLastNDaysRange(7)
  const { data: recentTransactions, isLoading: transactionsLoading } =
    useTransactions({ ...last7Days, limit: 200 })
  const { data: currentMonth, isLoading: currentLoading } =
    useTransactionsSummary(getMonthRange(0))
  const { data: previousMonth, isLoading: previousLoading } =
    useTransactionsSummary(getMonthRange(1))

  const isLoading =
    accountsLoading || transactionsLoading || currentLoading || previousLoading

  const balance = (accounts ?? []).reduce(
    (sum, account) => sum + Number(account.balance),
    0
  )
  const dailyFlow = buildDailyFlow(recentTransactions?.data ?? [])
  const net = (currentMonth?.net ?? 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium text-muted-foreground">
          Balance overview
        </CardTitle>
        <p className="text-2xl font-semibold text-foreground">
          {formatCurrency(balance)}
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[220px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart data={dailyFlow} barCategoryGap={24}>
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
