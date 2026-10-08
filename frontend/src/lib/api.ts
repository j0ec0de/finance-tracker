const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
  token?: string | null
}

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, token }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers["Content-Type"] = "application/json"
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = res.status === 204 ? null : await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.error || "Something went wrong"
    throw new ApiError(res.status, message)
  }

  return data as T
}
