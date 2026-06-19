import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse } from "@/types/api"

export function useDeleteSucursal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch<ApiResponse<{ eliminacion: "permanente" | "logica" }>>(
        ENDPOINTS.SUCURSALES.DELETE(id),
        { method: "DELETE" },
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sucursales"] })
      queryClient.invalidateQueries({ queryKey: ["sucursales-all"] })
    },
  })
}
