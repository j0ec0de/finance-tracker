import { cn } from "@/lib/utils"

type MeterProps = {
  value: number
  max: number
  className?: string
}

export function Meter({ value, max, className }: MeterProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2.5 w-full overflow-hidden rounded-full",
        className
      )}
      style={{ backgroundColor: "color-mix(in oklch, var(--chart-1) 16%, var(--background))" }}
    >
      <div
        className="h-full rounded-full bg-[var(--chart-1)] transition-[width]"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
