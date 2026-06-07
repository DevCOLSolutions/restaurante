import { useEffect } from "react"
import { useMe } from "@/hooks/useMe"
import { useAuthStore } from "@/core/auth/store"

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)
  const { data, isLoading } = useMe()

  useEffect(() => {
    if (!data) return
    const u = data.data
    login({
      id: u.userId,
      name: u.fullName,
      email: u.email,
      role: u.role,
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

  if (!isAuthenticated && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" />
      </div>
    )
  }

  return <>{children}</>
}
