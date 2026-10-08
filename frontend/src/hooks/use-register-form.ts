import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "@/hooks/use-auth"
import { ApiError } from "@/lib/api"

export function useRegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await register(name, email, password)
      navigate("/", { replace: true })
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  }
}
