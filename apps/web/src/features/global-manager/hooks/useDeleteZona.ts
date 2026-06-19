import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse } from "@/types/api"

export function useDeleteZona() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiFetch<ApiResponse<null>>(ENDPOINTS.ZONAS.DELETE(id), {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zonas"] })
      queryClient.invalidateQueries({ queryKey: ["zonas-por-sucursal"] })
    },
  })
}
