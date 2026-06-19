import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import type { ApiResponse, Sucursal } from "@/types/api"

export function useSucursalesAll() {
  return useQuery({
    queryKey: ["sucursales-all"],
    queryFn: async () => {
      const res = await apiFetch<ApiResponse<Sucursal[]>>("/Sucursal")
      return res.data ?? []
    },
  })
}
