import { Link } from "react-router-dom"
import { ArrowRight, Lock, Mail } from "lucide-react"

import { useLoginForm } from "@/hooks/use-login-form"
import { AuthLayout } from "@/components/auth/auth-layout"
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
    <AuthLayout title="Welcome back" description="Sign in to your account to continue">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
          <p className="animate-in fade-in text-sm text-destructive">{error}</p>
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
    </AuthLayout>
  )
}
