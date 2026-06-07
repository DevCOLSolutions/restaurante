import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, Sucursal } from "@/types/api"

export function useSucursal(id: string | undefined) {
  return useQuery({
    queryKey: ["sucursal", id],
    queryFn: async () => {
      if (!id) return null
      const res = await apiFetch<ApiResponse<Sucursal>>(ENDPOINTS.SUCURSALES.GET(id))
      return res.data
    },
    enabled: !!id,
  })
}
