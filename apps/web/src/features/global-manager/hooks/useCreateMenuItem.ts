import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, MenuProducto } from "@/types/api"

export interface CreateItemPayload {
  categoriaId: string
  areaRecepcionId: string
  nombre: string
  descripcion: string | null
  precio: number
  costo: number
  impuestoPct: number
  disponible: boolean
  esModificable: boolean
  tiempoPrepMin: number
  calorias: number
  etiquetas: string[]
  orden: number
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateItemPayload) => {
      const res = await apiFetch<ApiResponse<MenuProducto>>(ENDPOINTS.MENU.ITEMS, {
        method: "POST",
        body: JSON.stringify(payload),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] })
    },
  })
}
