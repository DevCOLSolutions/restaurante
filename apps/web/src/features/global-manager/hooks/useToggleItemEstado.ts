import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse } from "@/types/api"

export interface ToggleEstadoPayload {
  id: string
  activo: boolean
}

export function useToggleItemEstado() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ToggleEstadoPayload) => {
      const res = await apiFetch<ApiResponse<unknown>>(ENDPOINTS.MENU.ITEM_ESTADO(payload.id), {
        method: "PATCH",
        body: JSON.stringify(payload),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] })
    },
  })
}
