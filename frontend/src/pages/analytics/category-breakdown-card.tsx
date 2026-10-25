import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useTransactionsByCategory } from "@/hooks/use-transactions"
import { ApiError } from "@/lib/api"
import { getLastNMonthsRange } from "@/lib/date-range"
import { useFormatCurrency } from "@/hooks/use-display-currency"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
]

type CategoryBreakdownCardProps = {
  months: number
}

export function CategoryBreakdownCard({ months }: CategoryBreakdownCardProps) {
  const formatCurrency = useFormatCurrency()
  const { data, isLoading, isError, error } = useTransactionsByCategory(
    getLastNMonthsRange(months)
  )

  const categories = (data?.data ?? [])
    .filter((c) => c.type === "expense")
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)
    .map((c, i) => ({ ...c, fill: CHART_COLORS[i % CHART_COLORS.length] }))

  const chartConfig = categories.reduce<ChartConfig>((config, category) => {
    config[category.categoryName] = {
      label: category.categoryName,
      color: category.fill,
    }
    return config
  }, {})

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Spending by category</CardTitle>
        <p className="text-sm text-muted-foreground">
          Top expense categories for the period
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : isError ? (
          <p className="py-8 text-center text-sm text-destructive">
            {error instanceof ApiError
              ? error.message
              : "Couldn't load category data."}
          </p>
        ) : categories.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No expenses in this period yet.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[260px] w-full"
            initialDimension={{ width: 320, height: 260 }}
          >
            <BarChart data={categories} layout="vertical" margin={{ left: 12 }}>
              <XAxis
                type="number"
                hide
              />
              <YAxis
                type="category"
                dataKey="categoryName"
                axisLine={false}
                tickLine={false}
                width={100}
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
              <Bar dataKey="total" name="Spent" radius={[0, 4, 4, 0]} maxBarSize={18}>
                {categories.map((category) => (
                  <Cell key={category.categoryId ?? "uncategorized"} fill={category.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
