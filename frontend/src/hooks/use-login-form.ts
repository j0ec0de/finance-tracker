import { useState, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { useAuth } from "@/hooks/use-auth"
import { ApiError } from "@/lib/api"

export function useLoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/"

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  }
}
