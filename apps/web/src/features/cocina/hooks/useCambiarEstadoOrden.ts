import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse } from "@/types/api"

export function useCambiarEstadoOrden() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: string }) => {
      const url = ENDPOINTS.ORDENES.CAMBIAR_ESTADO_PRODUCTO(id)
      console.log("🟡 PATCH", url, { id, estado })
      const res = await apiFetch<ApiResponse<unknown>>(url, {
        method: "PATCH",
        body: JSON.stringify({ id, estado }),
      })
      console.log("🟢 Respuesta", res)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cocina", "productos-mi-area"] })
    },
    onError: (error) => {
      console.error("🔴 Error", error)
      alert(error instanceof Error ? error.message : "Error al cambiar estado")
    },
  })
}
