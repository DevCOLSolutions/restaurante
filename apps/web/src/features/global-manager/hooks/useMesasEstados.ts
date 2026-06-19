import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, Mesa } from "@/types/api"

export function useMesasEstados(sucursalId: string | undefined) {
  return useQuery({
    queryKey: ["mesas-estados", sucursalId],
    queryFn: async () => {
      if (!sucursalId) return { total: 0, grupos: [] }
      const res = await apiFetch<ApiResponse<Mesa[]>>(ENDPOINTS.SUCURSALES.MESAS(sucursalId))
      const mesas = res.data ?? []
      const gruposMap = new Map<string, Mesa[]>()
      for (const mesa of mesas) {
        const key = mesa.estado
        if (!gruposMap.has(key)) gruposMap.set(key, [])
        gruposMap.get(key)!.push(mesa)
      }
      const grupos = Array.from(gruposMap.entries()).map(([estado, ms]) => ({
        estado,
        cantidad: ms.length,
        mesas: ms,
      }))
      return { total: mesas.length, grupos }
    },
    enabled: !!sucursalId,
  })
}
