import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, MenuProducto } from "@/types/api"

export interface UpdateItemPayload {
  id: string
  categoriaId: string | null
  areaRecepcionId: string | null
  nombre: string | null
  descripcion: string | null
  precio: number
  costo: number
  impuestoPct: number
  disponible: boolean | null
  esModificable: boolean | null
  tiempoPrepMin: number
  calorias: number
  etiquetas: string[]
  orden: number
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateItemPayload) => {
      const res = await apiFetch<ApiResponse<MenuProducto>>(ENDPOINTS.MENU.ITEM(payload.id), {
        method: "PUT",
        body: JSON.stringify(payload),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] })
    },
  })
}
