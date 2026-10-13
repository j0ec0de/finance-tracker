import { Target } from "lucide-react"

import { useGoals } from "@/hooks/use-goals"
import { ApiError } from "@/lib/api"
import { formatCurrency } from "@/lib/format"
import { PagePlaceholder } from "@/components/layout/page-placeholder"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Meter } from "@/pages/dashboard/meter"

export function GoalTrackerCard() {
  const { data: goals, isLoading, isError, error } = useGoals()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Goal tracker</CardTitle>
        <p className="text-sm text-muted-foreground">Savings goals</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
          <>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-destructive">
            {error instanceof ApiError
              ? error.message
              : "Couldn't load goals. Please try again."}
          </p>
        ) : (goals ?? []).length > 0 ? (
          goals!.map((goal) => {
            const saved = Number(goal.savedAmount)
            const target = Number(goal.targetAmount)
            const remaining = target - saved
            return (
              <div key={goal.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-medium">{goal.name}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {formatCurrency(saved)} / {formatCurrency(target)}
                  </span>
                </div>
                <Meter value={saved} max={target} />
                <p className="text-xs text-muted-foreground">
                  {remaining <= 0
                    ? "Target reached"
                    : `Left to save · ${formatCurrency(remaining)}`}
                </p>
              </div>
            )
          })
        ) : (
          <PagePlaceholder
            icon={Target}
            title="No goals yet"
            description="Add a savings goal to track it here."
          />
        )}
      </CardContent>
    </Card>
  )
}
