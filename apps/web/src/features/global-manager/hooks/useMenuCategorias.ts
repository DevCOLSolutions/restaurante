import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, MenuCategoria } from "@/types/api"

export function useMenuCategorias() {
  return useQuery({
    queryKey: ["menu-categorias", "global-manager"],
    queryFn: async () => {
      const res = await apiFetch<ApiResponse<MenuCategoria[]>>(ENDPOINTS.MENU.CATEGORIAS)
      return res.data ?? []
    },
    staleTime: 1000 * 60 * 30,
  })
}
