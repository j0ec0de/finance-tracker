import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import { financialHealth } from "@/pages/dashboard/mock-data"

const RADIUS = 54
const STROKE = 10
const CIRCUMFERENCE = Math.PI * RADIUS

export function FinancialHealthCard() {
  const pct = Math.min(100, financialHealth.percentSaved)
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Financial health
        </CardTitle>
        <p className="text-sm text-muted-foreground">Current status</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-1">
        <p className="self-start text-2xl font-semibold">
          {formatCurrency(financialHealth.value)}
        </p>
        <p className="self-start text-xs font-medium text-[var(--status-good)]">
          +{financialHealth.deltaPct}% from last month
        </p>

        <svg
          viewBox="0 0 120 68"
          className="mt-2 w-full max-w-[180px]"
          role="img"
          aria-label={`${pct}% of monthly income saved`}
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
            {pct}%
          </text>
        </svg>
        <p className="text-center text-xs text-muted-foreground">
          Of monthly income saved, based on the last 30 days
        </p>
      </CardContent>
    </Card>
  )
}
