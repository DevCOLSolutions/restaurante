import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, Orden } from "@/types/api"

export function useOrdenesPorMesa(mesaId: string | undefined) {
  return useQuery({
    queryKey: ["ordenes-por-mesa", mesaId],
    queryFn: async () => {
      if (!mesaId) return []
      const res = await apiFetch<ApiResponse<Orden[]>>(ENDPOINTS.ORDENES.POR_MESA(mesaId))
      return res.data ?? []
    },
    enabled: !!mesaId,
    refetchInterval: 10_000,
  })
}
