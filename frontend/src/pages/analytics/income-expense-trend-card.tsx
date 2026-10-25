import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useTransactionsTrend } from "@/hooks/use-transactions"
import { ApiError } from "@/lib/api"
import { useFormatCurrency } from "@/hooks/use-display-currency"

const chartConfig = {
  income: { label: "Income", color: "var(--chart-1)" },
  expense: { label: "Expenses", color: "var(--chart-2)" },
} satisfies ChartConfig

type IncomeExpenseTrendCardProps = {
  months: number
}

export function IncomeExpenseTrendCard({ months }: IncomeExpenseTrendCardProps) {
  const formatCurrency = useFormatCurrency()
  const { data, isLoading, isError, error } = useTransactionsTrend(months)
  const hasActivity = data.some((point) => point.income > 0 || point.expense > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Income vs expenses</CardTitle>
        <p className="text-sm text-muted-foreground">Monthly trend</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : isError ? (
          <p className="py-8 text-center text-sm text-destructive">
            {error instanceof ApiError ? error.message : "Couldn't load trend data."}
          </p>
        ) : !hasActivity ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No transactions in this period yet.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <LineChart data={data}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="month"
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
              <Line
                type="monotone"
                dataKey="income"
                stroke="var(--color-income)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="var(--color-expense)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
