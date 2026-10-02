import { TrendingDown, TrendingUp } from "lucide-react"

import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

type StatTileProps = {
  label: string
  value: number
  deltaPct: number
}

export function StatTile({ label, value, deltaPct }: StatTileProps) {
  const isUp = deltaPct >= 0

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold">{formatCurrency(value)}</span>
      <span
        className={cn(
          "flex items-center gap-1 text-xs font-medium",
          isUp ? "text-[var(--status-good)]" : "text-[var(--status-critical)]"
        )}
      >
        {isUp ? (
          <TrendingUp className="size-3.5" />
        ) : (
          <TrendingDown className="size-3.5" />
        )}
        {Math.abs(deltaPct)}% from last month
      </span>
    </div>
  )
}
