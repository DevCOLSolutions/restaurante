import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"
import type { ApiResponse, NotificacionesResponse, Notificacion } from "@/types/api"

export function useNotificaciones(page = 1, pageSize = 50) {
  const sucursalId = useAuthStore((s) => s.user?.sucursalId)

  return useQuery({
    queryKey: ["notificaciones", sucursalId, page, pageSize],
    queryFn: async () => {
      if (!sucursalId) return []
      const res = await apiFetch<ApiResponse<NotificacionesResponse>>(
        `${ENDPOINTS.NOTIFICACIONES.LIST}?sucursalId=${sucursalId}&page=${page}&pageSize=${pageSize}`
      )
      return res.data?.items ?? []
    },
    enabled: !!sucursalId,
    select: (data: Notificacion[]) => data,
  })
}
