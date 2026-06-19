import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse } from "@/types/api"

export function useTransferirUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, sucursalId }: { id: string; sucursalId: string }) => {
      const res = await apiFetch<ApiResponse<unknown>>(ENDPOINTS.USUARIOS.UPDATE(id), {
        method: "PUT",
        body: JSON.stringify({
          id,
          nombre: null,
          correo: null,
          rol: null,
          sucursalId,
          areaCocinaId: null,
        }),
      })
      return res.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["usuario", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["usuarios"] })
      queryClient.invalidateQueries({ queryKey: ["usuarios-por-sucursal"] })
    },
  })
}
