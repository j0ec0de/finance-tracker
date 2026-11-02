import { useFormatCurrency } from "@/hooks/use-display-currency"
import { cn } from "@/lib/utils"

type StatProps = { label: string; value: number; negative?: boolean }

function Stat({ label, value, negative }: StatProps) {
  const formatCurrency = useFormatCurrency()
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={cn(
          "text-2xl font-semibold",
          negative && "text-[var(--status-critical)]"
        )}
      >
        {formatCurrency(value)}
      </p>
    </div>
  )
}

export function PlannerSummary({
  balance,
  planned,
}: {
  balance: number
  planned: number
}) {
  const remaining = balance - planned
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Stat label="Current balance" value={balance} />
      <Stat label="Planned expenses" value={planned} />
      <Stat label="Balance after" value={remaining} negative={remaining < 0} />
    </div>
  )
}
