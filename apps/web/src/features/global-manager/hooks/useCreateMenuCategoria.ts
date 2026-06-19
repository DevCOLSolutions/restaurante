import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, MenuCategoria } from "@/types/api"

export interface CreateCategoriaPayload {
  nombre: string
  descripcion: string | null
  orden: number
}

export function useCreateMenuCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateCategoriaPayload) => {
      const res = await apiFetch<ApiResponse<MenuCategoria>>(ENDPOINTS.MENU.CATEGORIAS, {
        method: "POST",
        body: JSON.stringify(payload),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categorias"] })
    },
  })
}
