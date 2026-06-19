import { useAuthStore } from "@/core/auth/store"

export const BASE_URL = import.meta.env.VITE_API_URL ?? "/api"

export class ApiRequestError extends Error {
  status: number
  body: unknown

  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.name = "ApiRequestError"
    this.status = status
    this.body = body
  }
}

let refreshPromise: Promise<boolean> | null = null

async function performRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  })

  if (response.status === 401 && !endpoint.includes("/auth/refresh")) {
    const refreshed = await performRefresh()

    if (refreshed) {
      return apiFetch<T>(endpoint, options)
    }

    useAuthStore.getState().logout()
    localStorage.removeItem("rest2025-auth")
    window.location.href = "/login"
    await new Promise(() => {})
  }

  if (!response.ok) {
    let body: unknown
    try {
      body = await response.json()
    } catch {
      body = null
    }
    throw new ApiRequestError(
      response.status,
      (body as { message?: string })?.message ?? response.statusText,
      body,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
