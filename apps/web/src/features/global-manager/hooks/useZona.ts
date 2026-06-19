import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, Zona } from "@/types/api"

export function useZona(id: string | undefined) {
  return useQuery({
    queryKey: ["zona", id],
    queryFn: async () => {
      if (!id) return null
      const res = await apiFetch<ApiResponse<Zona>>(ENDPOINTS.ZONAS.GET(id))
      return res.data
    },
    enabled: !!id,
  })
}
