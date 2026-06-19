import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse } from "@/types/api"

interface RemoverAdminRequest {
  sucursalId: string
  usuarioId: string
}

export function useRemoverAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ sucursalId, usuarioId }: RemoverAdminRequest) => {
      const res = await apiFetch<ApiResponse<null>>(
        ENDPOINTS.SUCURSALES.REMOVER_ADMIN(sucursalId),
        {
          method: "POST",
          body: JSON.stringify({ sucursalId, usuarioId }),
        },
      )
      return res.data
    },
    onSuccess: (_data, { sucursalId }) => {
      queryClient.invalidateQueries({ queryKey: ["sucursal", sucursalId] })
    },
  })
}
