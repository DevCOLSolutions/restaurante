import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"
import type { ApiResponse, Sucursal } from "@/types/api"

export function useSucursales() {
  const restaurantId = useAuthStore((s) => s.user?.restaurantId)

  return useQuery({
    queryKey: ["sucursales", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return []
      const res = await apiFetch<ApiResponse<Sucursal[]>>(ENDPOINTS.SUCURSALES.POR_RESTAURANTE(restaurantId))
      return res.data ?? []
    },
    enabled: !!restaurantId,
  })
}
