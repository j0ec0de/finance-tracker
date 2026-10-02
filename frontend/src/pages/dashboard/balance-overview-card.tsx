import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
import { formatCurrency } from "@/lib/format"
import { summaryStats, weeklyFlow } from "@/pages/dashboard/mock-data"
import { StatTile } from "@/pages/dashboard/stat-tile"

const chartConfig = {
  income: { label: "Income", color: "var(--chart-1)" },
  expenses: { label: "Expenses", color: "var(--chart-2)" },
  savings: { label: "Savings", color: "var(--chart-3)" },
} satisfies ChartConfig

export function BalanceOverviewCard() {
  const balance =
    summaryStats.totalIncome.value - summaryStats.totalExpenses.value

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
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <BarChart data={weeklyFlow} barCategoryGap={24}>
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
            <Bar
              dataKey="savings"
              fill="var(--color-savings)"
              radius={[4, 4, 0, 0]}
              maxBarSize={18}
            />
          </BarChart>
        </ChartContainer>
        <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-4">
          <StatTile
            label="Total income"
            value={summaryStats.totalIncome.value}
            deltaPct={summaryStats.totalIncome.deltaPct}
          />
          <StatTile
            label="Total expenses"
            value={summaryStats.totalExpenses.value}
            deltaPct={summaryStats.totalExpenses.deltaPct}
          />
          <StatTile
            label="Saved balance"
            value={summaryStats.savedBalance.value}
            deltaPct={summaryStats.savedBalance.deltaPct}
          />
        </div>
      </CardContent>
    </Card>
  )
}
