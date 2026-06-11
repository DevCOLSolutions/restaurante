import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"
import type { ApiResponse, DashboardMesas } from "@/types/api"

export function useDashboardResumen() {
  const sucursalId = useAuthStore((s) => s.user?.sucursalId)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: ["dashboard-mesas", sucursalId],
    queryFn: async () => {
      const res = await apiFetch<ApiResponse<DashboardMesas>>(
        `${ENDPOINTS.DASHBOARD.MESAS}?sucursalId=${sucursalId}`,
      )
      return res.data
    },
    enabled: isAuthenticated && !!sucursalId,
  })
}
