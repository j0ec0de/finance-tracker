import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import { Meter } from "@/pages/dashboard/meter"
import { goals } from "@/pages/dashboard/mock-data"

export function GoalTrackerCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Goal tracker</CardTitle>
        <p className="text-sm text-muted-foreground">Savings goals</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {goals.map((goal) => (
          <div key={goal.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{goal.name}</span>
              <span className="text-muted-foreground">
                {formatCurrency(goal.saved)} / {formatCurrency(goal.target)}
              </span>
            </div>
            <Meter value={goal.saved} max={goal.target} />
            <p className="text-xs text-muted-foreground">
              Left to save · {goal.eta}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
