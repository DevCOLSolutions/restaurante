import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, Zona } from "@/types/api"

export function useZonasPorSucursal(sucursalId: string | undefined) {
  return useQuery({
    queryKey: ["zonas-por-sucursal", sucursalId],
    queryFn: async () => {
      if (!sucursalId) return []
      const res = await apiFetch<ApiResponse<Zona[]>>(ENDPOINTS.ZONAS.POR_SUCURSAL(sucursalId))
      return res.data ?? []
    },
    enabled: !!sucursalId,
  })
}
