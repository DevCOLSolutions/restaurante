import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, MenuProducto } from "@/types/api"

export function useMenuItems(params?: { categoriaId?: string; disponible?: boolean; activo?: boolean; buscar?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.categoriaId) searchParams.set("categoriaId", params.categoriaId)
  if (params?.disponible !== undefined) searchParams.set("disponible", String(params.disponible))
  if (params?.activo !== undefined) searchParams.set("activo", String(params.activo))
  if (params?.buscar) searchParams.set("buscar", params.buscar)
  const qs = searchParams.toString()

  return useQuery({
    queryKey: ["menu-items", "global-manager", params],
    queryFn: async () => {
      const res = await apiFetch<ApiResponse<MenuProducto[]>>(`${ENDPOINTS.MENU.ITEMS}${qs ? `?${qs}` : ""}`)
      return res.data ?? []
    },
    staleTime: 1000 * 60 * 30,
  })
}
