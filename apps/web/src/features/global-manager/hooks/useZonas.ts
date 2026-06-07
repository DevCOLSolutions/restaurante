import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"
import type { ApiResponse, Zona } from "@/types/api"

export function useZonas() {
  const sucursalId = useAuthStore((s) => s.user?.sucursalId)

  return useQuery({
    queryKey: ["zonas", sucursalId],
    queryFn: async () => {
      if (!sucursalId) return []
      const res = await apiFetch<ApiResponse<Zona[]>>(ENDPOINTS.ZONAS.POR_SUCURSAL(sucursalId))
      return res.data ?? []
    },
    enabled: !!sucursalId,
  })
}
