import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"

export function useMarcarLeida() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiFetch(ENDPOINTS.NOTIFICACIONES.MARK_READ(id), {
        method: "PATCH",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] })
      queryClient.invalidateQueries({ queryKey: ["notificaciones-no-leidas"] })
    },
  })
}
