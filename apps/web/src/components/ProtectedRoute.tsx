import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/core/auth/store"
import { getPrimaryDashboardForRoles } from "@/core/auth/utils"
import type { UserRole } from "@/core/auth/types"

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
  children?: React.ReactNode
}

export function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const roles = user?.roles ?? []

  if (allowedRoles && !roles.some((r) => allowedRoles.includes(r as UserRole))) {
    return <Navigate to={getPrimaryDashboardForRoles(roles)} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
