import { useEffect, useRef } from "react"
import { useMe } from "@/hooks/useMe"
import { useAuthStore } from "@/core/auth/store"
import { BASE_URL } from "@/lib/apiClient"

function scheduleRefresh(expiresAt: string) {
  const expiresInMs = new Date(expiresAt).getTime() - Date.now()
  const refreshInMs = Math.max(expiresInMs - 5 * 60 * 1000, 10_000)

  return setTimeout(async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      })
      if (res.ok) {
        const body = await res.json()
        const newExpiresAt: string | undefined = body.expiresAt ?? body.data?.expiresAt
        if (newExpiresAt) {
          useAuthStore.getState().setExpiresAt(newExpiresAt)
        }
      }
    } catch {
      // refresh silencioso falló — el interceptor 401 lo manejará
    }
  }, refreshInMs)
}

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const expiresAt = useAuthStore((s) => s.expiresAt)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)
  const setExpiresAt = useAuthStore((s) => s.setExpiresAt)
  const { data, isLoading } = useMe()
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (!data) return
    const u = data.data
    console.log("[DEBUG] AuthInitializer - /auth/me response:", { userId: u.userId, role: u.role, roles: u.roles })
    login({
      id: u.userId,
      name: u.fullName,
      email: u.email,
      role: u.role,
      roles: u.roles ?? [u.role],
      restaurantId: u.restauranteId,
      sucursalId: u.sucursalId,
    })
  }, [data, login])

  useEffect(() => {
    if (isLoading || data === undefined) return
    if (data === null && isAuthenticated) {
      logout()
      localStorage.removeItem("rest2025-auth")
    }
  }, [data, isLoading, isAuthenticated, logout])

  useEffect(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current)

    if (!isAuthenticated || !expiresAt) return

    refreshTimer.current = scheduleRefresh(expiresAt)

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current)
    }
  }, [isAuthenticated, expiresAt, setExpiresAt])

  if (!isAuthenticated && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" />
      </div>
    )
  }

  return <>{children}</>
}
