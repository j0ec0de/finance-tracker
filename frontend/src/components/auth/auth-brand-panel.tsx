import { LineChart, Wallet } from "lucide-react"

import { BrandMark } from "@/components/auth/brand-mark"

const currentYear = new Date().getFullYear()

function AuthBrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="auth-grid-pan absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--primary-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--primary-foreground) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="auth-blob-1 absolute -top-32 -left-20 size-96 rounded-full bg-chart-1/30 blur-3xl" />
        <div className="auth-blob-2 absolute top-1/3 -right-24 size-80 rounded-full bg-chart-5/25 blur-3xl" />
        <div className="auth-blob-3 absolute bottom-0 left-1/4 size-72 rounded-full bg-chart-3/20 blur-3xl" />
      </div>

      <BrandMark className="relative z-10 animate-in fade-in slide-in-from-top-2 duration-700" />

      <div className="relative z-10 max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

      <p className="relative z-10 text-xs text-primary-foreground/50">
        &copy; {currentYear} Finch
      </p>
    </div>
  )
}

export { AuthBrandPanel }
