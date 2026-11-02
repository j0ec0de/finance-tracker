import { Calculator, Trash2 } from "lucide-react"

import { useAccounts } from "@/hooks/use-accounts"
import { useBudgets } from "@/hooks/use-budgets"
import { useCategories } from "@/hooks/use-categories"
import { useDisplayCurrency, useFormatCurrency } from "@/hooks/use-display-currency"
import { usePlannedExpenses } from "@/hooks/use-planned-expenses"
import { ApiError } from "@/lib/api"
import { computeBudgetImpacts, sumPlanned } from "@/lib/planner"
import { PagePlaceholder } from "@/components/layout/page-placeholder"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BudgetImpactList } from "@/pages/planner/budget-impact-list"
import { PlannedExpenseForm } from "@/pages/planner/planned-expense-form"
import { PlannerSummary } from "@/pages/planner/planner-summary"

export default function PlannerPage() {
  const formatCurrency = useFormatCurrency()
  const currency = useDisplayCurrency()
  const accounts = useAccounts()
  const budgets = useBudgets()
  const categories = useCategories()
  const { items, add, remove, clear } = usePlannedExpenses()

  const isLoading = accounts.isLoading || budgets.isLoading || categories.isLoading
  const loadError = accounts.error ?? budgets.error ?? categories.error

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <p className="py-8 text-center text-sm text-destructive">
          {loadError instanceof ApiError
            ? loadError.message
            : "Couldn't load your data. Please try again."}
        </p>
      </div>
    )
  }

  // Balances in different currencies can't be added, so only count the display currency.
  const balance = (accounts.data ?? [])
    .filter((account) => account.currency === currency)
    .reduce((sum, account) => sum + Number(account.balance), 0)
  const planned = sumPlanned(items)
  const expenseCategories = (categories.data ?? []).filter((c) => c.type === "expense")
  const categoryNameById = new Map((categories.data ?? []).map((c) => [c.id, c.name]))
  const impacts = computeBudgetImpacts(budgets.data ?? [], items)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>What-if planner</CardTitle>
          <p className="text-sm text-muted-foreground">
            Try out expenses before you make them. Nothing here is saved or
            added to your transactions.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <PlannedExpenseForm categories={expenseCategories} onAdd={add} />
          <PlannerSummary balance={balance} planned={planned} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <CardTitle>Planned expenses</CardTitle>
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={clear}>
              Clear all
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <ul className="divide-y">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.categoryId !== null
                        ? (categoryNameById.get(item.categoryId) ?? "Unknown category")
                        : "No category"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {formatCurrency(item.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => remove(item.id)}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <PagePlaceholder
              icon={Calculator}
              title="Nothing planned yet"
              description="Add an expense above to see how it would affect your balance and budgets."
            />
          )}
        </CardContent>
      </Card>

      {impacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budget impact</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetImpactList impacts={impacts} categoryNameById={categoryNameById} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
