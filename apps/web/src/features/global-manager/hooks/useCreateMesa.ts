import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, Mesa } from "@/types/api"

export interface CreateMesaPayload {
  sucursalId: string
  zonaId: string
  numero: number
  nombre: string
  capacidad: number
}

export function useCreateMesa() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateMesaPayload) => {
      const res = await apiFetch<ApiResponse<Mesa>>(ENDPOINTS.MESAS.CREATE, {
        method: "POST",
        body: JSON.stringify(payload),
      })
      return res.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mesas-estados", variables.sucursalId] })
    },
  })
}
