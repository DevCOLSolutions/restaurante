import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"
import type { ApiResponse, Sucursal } from "@/types/api"

export interface CreateSucursalPayload {
  nombre: string
  direccion: string | null
  telefono: string | null
  cantidadMesas: number
}

export function useCreateSucursal() {
  const restaurantId = useAuthStore((s) => s.user?.restaurantId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateSucursalPayload) => {
      const body = { ...payload, restauranteId: restaurantId }
      const res = await apiFetch<ApiResponse<Sucursal>>(ENDPOINTS.SUCURSALES.CREATE, {
        method: "POST",
        body: JSON.stringify(body),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sucursales"] })
    },
  })
}
