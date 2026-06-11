import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, MenuProducto } from "@/types/api"

export function useMenuItems() {
  return useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const res = await apiFetch<ApiResponse<MenuProducto[]>>(ENDPOINTS.MENU.ITEMS)
      return res.data ?? []
    },
    staleTime: 1000 * 60 * 30,
  })
}
