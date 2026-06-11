import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"
import type { ApiResponse, Orden } from "@/types/api"

export function useOrdenesPorMesero() {
  
  const userId = useAuthStore((s) => s.user?.id)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  

  return useQuery({
    queryKey: ["ordenes-por-mesero", userId],
    queryFn: async () => {
      if (!userId) return []
      const res = await apiFetch<ApiResponse<Orden[]>>(ENDPOINTS.ORDENES.POR_MESERO(userId))
      return res.data ?? []
    },
    enabled: isAuthenticated && !!userId,
    refetchInterval: 10_000,
  })
}
