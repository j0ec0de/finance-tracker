import { CheckCircle2, XCircle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import { recentTransactions } from "@/pages/dashboard/mock-data"

export function TransactionHistoryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Transaction history
        </CardTitle>
        <p className="text-sm text-muted-foreground">Last 7 days</p>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {recentTransactions.map((transaction) => {
            const isPositive = transaction.amount > 0
            const isDeclined = transaction.status === "declined"

            return (
              <li
                key={transaction.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {transaction.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.date}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span
                    className={cn(
                      "text-sm font-medium tabular-nums",
                      isPositive
                        ? "text-[var(--status-good)]"
                        : "text-foreground"
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {formatCurrency(transaction.amount)}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      isDeclined
                        ? "text-[var(--status-critical)]"
                        : "text-muted-foreground"
                    )}
                  >
                    {isDeclined ? (
                      <XCircle className="size-3.5" />
                    ) : (
                      <CheckCircle2 className="size-3.5" />
                    )}
                    {isDeclined ? "Declined" : "Completed"}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
