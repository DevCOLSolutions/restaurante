import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse } from "@/types/api"

export function useDesactivarAreaCocina() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch<ApiResponse<unknown>>(ENDPOINTS.COCINA.DESACTIVAR(id), {
        method: "PATCH",
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas-cocina"] })
    },
  })
}
