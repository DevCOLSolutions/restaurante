import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, UsuarioItem } from "@/types/api"

export interface CreateUsuarioPayload {
  nombre: string
  correo: string
  username: string
  password: string
  sucursalId: string
  rol: string
  areaCocinaId: string | null
}

export function useCreateUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUsuarioPayload) => {
      const res = await apiFetch<ApiResponse<UsuarioItem>>(ENDPOINTS.USUARIOS.CREATE, {
        method: "POST",
        body: JSON.stringify(payload),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] })
    },
  })
}
