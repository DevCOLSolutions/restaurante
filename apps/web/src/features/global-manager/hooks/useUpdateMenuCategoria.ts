import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, MenuCategoria } from "@/types/api"

export interface UpdateCategoriaPayload {
  id: string
  nombre: string | null
  descripcion: string | null
  orden: number
  activa: boolean | null
}

export function useUpdateMenuCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateCategoriaPayload) => {
      const res = await apiFetch<ApiResponse<MenuCategoria>>(
        ENDPOINTS.MENU.CATEGORIA(payload.id),
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categorias"] })
    },
  })
}
