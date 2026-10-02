import { PiggyBank } from "lucide-react"

import { PagePlaceholder } from "@/components/layout/page-placeholder"

export default function BudgetsPage() {
  return (
    <PagePlaceholder
      icon={PiggyBank}
      title="Budgets coming soon"
      description="Set monthly budgets per category and track progress here."
    />
  )
}
