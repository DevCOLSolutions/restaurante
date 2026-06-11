import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"
import type { ApiResponse, ProductoAreaCocina } from "@/types/api"

export function useProductosMiArea(areaCocinaId?: string) {
  const sucursalId = useAuthStore((s) => s.user?.sucursalId)

  return useQuery({
    queryKey: ["cocina", "productos-mi-area", sucursalId, areaCocinaId],
    queryFn: async () => {
      if (areaCocinaId && sucursalId) {
        const res = await apiFetch<ApiResponse<ProductoAreaCocina[]>>(
          ENDPOINTS.COCINA.PRODUCTOS_POR_AREA(sucursalId, areaCocinaId),
        )
        return res.data ?? []
      }
      const res = await apiFetch<ApiResponse<ProductoAreaCocina[]>>(ENDPOINTS.COCINA.PRODUCTOS_MI_AREA)
      return res.data ?? []
    },
    refetchInterval: 30_000,
  })
}
