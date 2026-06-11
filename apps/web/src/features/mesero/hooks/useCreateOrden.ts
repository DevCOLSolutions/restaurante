import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"
import type { ApiResponse, Orden } from "@/types/api"

export interface CreateOrdenPayload {
  mesaId: string
  notas: string | null
  dedicatoria: string | null
  productos: { itemMenuId: string; cantidad: number; notas: string | null }[]
}

export function useCreateOrden() {
  const sucursalId = useAuthStore((s) => s.user?.sucursalId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateOrdenPayload) => {
      const body = { ...payload, sucursalId }
      const res = await apiFetch<ApiResponse<Orden>>(ENDPOINTS.ORDENES.CREATE, {
        method: "POST",
        body: JSON.stringify(body),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-por-mesero"] })
      queryClient.invalidateQueries({ queryKey: ["ordenes-por-mesa"] })
      queryClient.invalidateQueries({ queryKey: ["mesas", sucursalId] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-mesas", sucursalId] })
    },
  })
}
