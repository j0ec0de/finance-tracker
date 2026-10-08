import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "@/hooks/use-auth"

export function ProtectedRoute() {
  const { token, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return null

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}
