import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import * as authApi from "@/lib/auth"
import type { AuthUser } from "@/lib/auth"

const TOKEN_STORAGE_KEY = "finch.token"

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY)
  )
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(() => !!token)

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }

    authApi
      .getMe(token)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        setToken(null)
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  const applySession = useCallback((session: { user: AuthUser; token: string }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, session.token)
    setToken(session.token)
    setUser(session.user)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      applySession(await authApi.login(email, password))
    },
    [applySession]
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      applySession(await authApi.register(name, email, password))
    },
    [applySession]
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, token, isLoading, login, register, logout }),
    [user, token, isLoading, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
