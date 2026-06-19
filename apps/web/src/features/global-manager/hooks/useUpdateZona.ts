import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, Zona } from "@/types/api"

export interface UpdateZonaPayload {
  id: string
  nombre?: string | null
  descripcion?: string | null
  activa?: boolean | null
}

export function useUpdateZona() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateZonaPayload) => {
      const { id, ...rest } = payload
      const body = { id, nombre: null, descripcion: null, activa: null, ...rest }
      const res = await apiFetch<ApiResponse<Zona>>(ENDPOINTS.ZONAS.UPDATE(id), {
        method: "PUT",
        body: JSON.stringify(body),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zona"] })
      queryClient.invalidateQueries({ queryKey: ["zonas"] })
      queryClient.invalidateQueries({ queryKey: ["zonas-por-sucursal"] })
    },
  })
}
