import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse } from "@/types/api"
import type { AreaCocinaItem } from "./useAreasCocina"

export interface UpdateAreaCocinaPayload {
  id: string
  nombre: string | null
  descripcion: string | null
  activa: boolean | null
}

export function useUpdateAreaCocina() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateAreaCocinaPayload) => {
      const res = await apiFetch<ApiResponse<AreaCocinaItem>>(ENDPOINTS.COCINA.UPDATE(payload.id), {
        method: "PUT",
        body: JSON.stringify(payload),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas-cocina"] })
    },
  })
}
