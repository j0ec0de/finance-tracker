import type { ReactNode } from "react"

import { AuthBrandPanel } from "@/components/auth/auth-brand-panel"
import { BrandMark } from "@/components/auth/brand-mark"

function AuthLayout({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <AuthBrandPanel />

      <div className="flex flex-col items-center justify-center gap-8 p-4 py-12">
        <BrandMark className="animate-in fade-in slide-in-from-top-2 duration-500 lg:hidden" />

        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10 duration-500 sm:p-8">
          <div className="space-y-1.5">
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

export { AuthLayout }
