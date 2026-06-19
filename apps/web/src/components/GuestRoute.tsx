import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/core/auth/store"
import { getPrimaryDashboardForRoles } from "@/core/auth/utils"

interface GuestRouteProps {
  children?: React.ReactNode
}

export function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)

  if (isAuthenticated) {
    const roles = user?.roles ?? []
    return <Navigate to={getPrimaryDashboardForRoles(roles)} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
