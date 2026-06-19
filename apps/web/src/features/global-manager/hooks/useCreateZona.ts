import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, Zona } from "@/types/api"

export interface CreateZonaPayload {
  sucursalId: string
  nombre: string
  descripcion?: string | null
}

export function useCreateZona() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateZonaPayload) => {
      const res = await apiFetch<ApiResponse<Zona>>(ENDPOINTS.ZONAS.CREATE, {
        method: "POST",
        body: JSON.stringify(payload),
      })
      return res.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["zonas-por-sucursal", variables.sucursalId] })
    },
  })
}
