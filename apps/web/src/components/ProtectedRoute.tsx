import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/core/auth/store"
import { getDashboardPathForRole } from "@/core/auth/utils"
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
  const role = useAuthStore((s) => s.user?.role)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role as UserRole)) {
    return <Navigate to={getDashboardPathForRole(role as UserRole)} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
