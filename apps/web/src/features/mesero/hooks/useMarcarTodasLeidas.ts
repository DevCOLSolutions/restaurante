import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"

export function useMarcarTodasLeidas() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await apiFetch(ENDPOINTS.NOTIFICACIONES.MARK_ALL_READ, {
        method: "PATCH",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] })
      queryClient.invalidateQueries({ queryKey: ["notificaciones-no-leidas"] })
    },
  })
}
