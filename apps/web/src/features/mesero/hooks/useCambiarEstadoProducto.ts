import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, OrdenProducto } from "@/types/api"

export function useCambiarEstadoProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ productoId, estado }: { productoId: string; estado: string }) => {
      const res = await apiFetch<ApiResponse<OrdenProducto>>(ENDPOINTS.ORDENES.CAMBIAR_ESTADO_PRODUCTO(productoId), {
        method: "PATCH",
        body: JSON.stringify({ id: productoId, estado }),
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-por-mesa"] })
      queryClient.invalidateQueries({ queryKey: ["ordenes-por-mesero"] })
    },
  })
}
