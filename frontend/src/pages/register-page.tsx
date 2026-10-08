import { Link } from "react-router-dom"
import { ArrowRight, Lock, Mail, User } from "lucide-react"

import { useRegisterForm } from "@/hooks/use-register-form"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"

export default function RegisterPage() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  } = useRegisterForm()

  return (
    <AuthLayout
      title="Create an account"
      description="Start tracking your finances in minutes"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute inset-y-0 left-2.5 my-auto size-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              autoComplete="name"
              required
              className="pl-8"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
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
              autoComplete="new-password"
              required
              minLength={8}
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
            "Creating account..."
          ) : (
            <>
              Create account
              <ArrowRight data-icon="inline-end" />
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
