import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse } from "@/types/api"

interface ToggleActivoPayload {
  usuarioId: string
  activo: boolean
}

export function useUpdateUsuarioEstado() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ usuarioId, activo }: ToggleActivoPayload) => {
      const res = await apiFetch<ApiResponse<unknown>>(ENDPOINTS.USUARIOS.ESTADO(usuarioId), {
        method: "PATCH",
        body: JSON.stringify({ activo }),
      })
      return res.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["usuario", variables.usuarioId] })
      queryClient.invalidateQueries({ queryKey: ["usuarios"] })
      queryClient.invalidateQueries({ queryKey: ["usuarios-por-sucursal"] })
    },
  })
}
