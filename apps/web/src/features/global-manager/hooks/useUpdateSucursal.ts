import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, Sucursal } from "@/types/api"

export interface UpdateSucursalPayload {
  id: string
  nombre: string | null
  direccion: string | null
  telefono: string | null
  cantidadMesas: number
}

export function useUpdateSucursal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateSucursalPayload) => {
      const res = await apiFetch<ApiResponse<Sucursal>>(ENDPOINTS.SUCURSALES.UPDATE(payload.id), {
        method: "PUT",
        body: JSON.stringify(payload),
      })
      return res.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sucursal", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["sucursales"] })
      queryClient.invalidateQueries({ queryKey: ["sucursales-all"] })
    },
  })
}
