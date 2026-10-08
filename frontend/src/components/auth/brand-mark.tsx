import { PiggyBank } from "lucide-react"

import { cn } from "@/lib/utils"

function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <PiggyBank className="size-4" />
      </div>
      <span className="text-base font-semibold">Finch</span>
    </div>
  )
}

export { BrandMark }
