import { useState } from "react"

import { CategoryBreakdownCard } from "@/pages/analytics/category-breakdown-card"
import { IncomeExpenseTrendCard } from "@/pages/analytics/income-expense-trend-card"
import { RangeSelect } from "@/pages/analytics/range-select"
import { SummaryStatsCard } from "@/pages/analytics/summary-stats-card"

export default function AnalyticsPage() {
  const [months, setMonths] = useState(6)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <RangeSelect months={months} onChange={setMonths} />
      </div>
      <SummaryStatsCard months={months} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <IncomeExpenseTrendCard months={months} />
        <CategoryBreakdownCard months={months} />
      </div>
    </div>
  )
}
