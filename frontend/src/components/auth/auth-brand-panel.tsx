import { LineChart, Wallet } from "lucide-react"

import { BrandMark } from "@/components/auth/brand-mark"

const currentYear = new Date().getFullYear()

function AuthBrandPanel() {
  return (
    <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
      <BrandMark />

      <div className="max-w-sm space-y-6">
        <p className="text-2xl leading-snug font-medium">
          Track every account, budget, and transaction in one place.
        </p>
        <ul className="space-y-3 text-sm text-primary-foreground/70">
          <li className="flex items-center gap-2.5">
            <Wallet className="size-4 shrink-0" />
            See every account's balance, kept in sync automatically
          </li>
          <li className="flex items-center gap-2.5">
            <LineChart className="size-4 shrink-0" />
            Spot spending trends across your categories
          </li>
        </ul>
      </div>

      <p className="text-xs text-primary-foreground/50">
        &copy; {currentYear} Finch
      </p>
    </div>
  )
}

export { AuthBrandPanel }
