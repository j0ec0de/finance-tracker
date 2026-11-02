import { useFormatCurrency } from "@/hooks/use-display-currency"
import type { BudgetImpact } from "@/lib/planner"
import { Meter } from "@/pages/dashboard/meter"

type Props = {
  impacts: BudgetImpact[]
  categoryNameById: Map<number, string>
}

export function BudgetImpactList({ impacts, categoryNameById }: Props) {
  const formatCurrency = useFormatCurrency()

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {impacts.map((impact) => (
        <li
          key={impact.budgetId}
          className="flex flex-col gap-3 rounded-lg border p-4"
        >
          <p className="font-medium">
            {categoryNameById.get(impact.categoryId) ?? "Unknown category"}
          </p>
          <Meter value={impact.projected} max={impact.limit} />
          <div className="flex items-center justify-between text-sm">
            <span className={impact.overBy > 0 ? "font-medium text-destructive" : "font-medium"}>
              {formatCurrency(impact.projected)}
            </span>
            <span className="text-muted-foreground">
              of {formatCurrency(impact.limit)}
            </span>
          </div>
          <p
            className={
              impact.overBy > 0
                ? "text-sm text-destructive"
                : "text-sm text-muted-foreground"
            }
          >
            {impact.overBy > 0
              ? `${formatCurrency(impact.overBy)} over budget`
              : `${formatCurrency(impact.limit - impact.projected)} left`}
            {" · "}
            {formatCurrency(impact.planned)} planned on top of{" "}
            {formatCurrency(impact.spent)} spent
          </p>
        </li>
      ))}
    </ul>
  )
}
