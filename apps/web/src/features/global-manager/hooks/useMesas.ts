import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"
import type { ApiResponse, Mesa } from "@/types/api"

export function useMesas() {
  const sucursalId = useAuthStore((s) => s.user?.sucursalId)

  return useQuery({
    queryKey: ["mesas", sucursalId],
    queryFn: async () => {
      if (!sucursalId) return []
      const res = await apiFetch<ApiResponse<Mesa[]>>(ENDPOINTS.SUCURSALES.MESAS(sucursalId))
      return res.data ?? []
    },
    enabled: !!sucursalId,
  })
}
