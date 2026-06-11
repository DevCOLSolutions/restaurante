import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"
import type { ApiResponse, NotificacionesNoLeidasCount } from "@/types/api"

export function useNotificacionesNoLeidas() {
  const sucursalId = useAuthStore((s) => s.user?.sucursalId)

  return useQuery({
    queryKey: ["notificaciones-no-leidas", sucursalId],
    queryFn: async () => {
      if (!sucursalId) return 0
      const res = await apiFetch<ApiResponse<NotificacionesNoLeidasCount>>(
        `${ENDPOINTS.NOTIFICACIONES.UNREAD_COUNT}?sucursalId=${sucursalId}`
      )
      return res.data?.cantidad ?? 0
    },
    enabled: !!sucursalId,
    refetchInterval: 15_000,
  })
}
