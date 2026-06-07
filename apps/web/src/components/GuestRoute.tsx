import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/core/auth/store"
import { getDashboardPathForRole } from "@/core/auth/utils"
import type { UserRole } from "@/core/auth/types"

interface GuestRouteProps {
  children?: React.ReactNode
}

export function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const role = useAuthStore((s) => s.user?.role)

  if (isAuthenticated) {
    return <Navigate to={role ? getDashboardPathForRole(role as UserRole) : "/app/global-manager"} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
