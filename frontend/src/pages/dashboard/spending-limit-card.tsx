import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import { Meter } from "@/pages/dashboard/meter"
import { monthlySpendingLimit } from "@/pages/dashboard/mock-data"

export function SpendingLimitCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Monthly spending limit
        </CardTitle>
        <p className="text-sm text-muted-foreground">Recipient accounts</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <Meter
          value={monthlySpendingLimit.spent}
          max={monthlySpendingLimit.limit}
        />
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {formatCurrency(monthlySpendingLimit.spent)}
          </span>
          <span className="text-muted-foreground">
            {formatCurrency(monthlySpendingLimit.limit)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
