import { BalanceOverviewCard } from "@/pages/dashboard/balance-overview-card"
import { CostAnalysisCard } from "@/pages/dashboard/cost-analysis-card"
import { FinancialHealthCard } from "@/pages/dashboard/financial-health-card"
import { GoalTrackerCard } from "@/pages/dashboard/goal-tracker-card"
import { SpendingLimitCard } from "@/pages/dashboard/spending-limit-card"
import { TransactionHistoryCard } from "@/pages/dashboard/transaction-history-card"

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <BalanceOverviewCard />
        <SpendingLimitCard />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CostAnalysisCard />
          <FinancialHealthCard />
        </div>
      </div>
      <div className="space-y-4">
        <GoalTrackerCard />
        <TransactionHistoryCard />
      </div>
    </div>
  )
}
