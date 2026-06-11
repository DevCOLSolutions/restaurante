import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"
import type { ApiResponse, Orden } from "@/types/api"

export function useCerrarOrden() {
  const sucursalId = useAuthStore((s) => s.user?.sucursalId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ordenId, mesaId }: { ordenId: string; mesaId: string }) => {
      await apiFetch<ApiResponse<Orden>>(ENDPOINTS.ORDENES.CERRAR(ordenId), {
        method: "POST",
      })
      await apiFetch(ENDPOINTS.MESAS.CAMBIAR_ESTADO(mesaId), {
        method: "PATCH",
        body: JSON.stringify({ id: mesaId, estado: "disponible" }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-por-mesero"] })
      queryClient.invalidateQueries({ queryKey: ["ordenes-por-mesa"] })
      queryClient.invalidateQueries({ queryKey: ["mesas", sucursalId] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-mesas", sucursalId] })
    },
  })
}
