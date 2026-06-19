import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse } from "@/types/api"
import type { AreaCocinaItem } from "./useAreasCocina"

export interface CreateAreaCocinaPayload {
  nombre: string
  descripcion: string | null
}

export function useCreateAreaCocina() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateAreaCocinaPayload) => {
      const res = await apiFetch<ApiResponse<AreaCocinaItem>>(ENDPOINTS.COCINA.CREATE, {
        method: "POST",
        body: JSON.stringify(payload),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas-cocina"] })
    },
  })
}
