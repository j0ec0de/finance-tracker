import { Link } from "react-router-dom"
import { ArrowRight, Lock, Mail } from "lucide-react"

import { useLoginForm } from "@/hooks/use-login-form"
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel"
import { BrandMark } from "@/components/auth/brand-mark"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  } = useLoginForm()

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <AuthBrandPanel />

      <div className="flex flex-col items-center justify-center gap-8 p-4 py-12">
        <BrandMark className="animate-in fade-in slide-in-from-top-2 duration-500 lg:hidden" />

        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10 duration-500 sm:p-8">
          <div className="space-y-1.5">
            <h1 className="text-xl font-semibold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute inset-y-0 left-2.5 my-auto size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-8"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute inset-y-0 left-2.5 my-auto size-4 text-muted-foreground" />
                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  required
                  className="pl-8"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="animate-in fade-in text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ArrowRight data-icon="inline-end" />
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
