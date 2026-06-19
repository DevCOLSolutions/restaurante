import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse } from "@/types/api"

export interface AreaCocinaItem {
  id: string
  nombre: string
  descripcion: string | null
  activa: boolean
}

export function useAreasCocina() {
  return useQuery({
    queryKey: ["areas-cocina"],
    queryFn: async () => {
      const res = await apiFetch<ApiResponse<AreaCocinaItem[]>>(ENDPOINTS.COCINA.LIST)
      return res.data ?? []
    },
  })
}

export function useAreasCocinaActivas() {
  return useQuery({
    queryKey: ["areas-cocina", "activas"],
    queryFn: async () => {
      const res = await apiFetch<ApiResponse<AreaCocinaItem[]>>(ENDPOINTS.COCINA.ACTIVAS)
      return res.data ?? []
    },
  })
}

export function useAreaCocina(id: string) {
  return useQuery({
    queryKey: ["areas-cocina", id],
    queryFn: async () => {
      const res = await apiFetch<ApiResponse<AreaCocinaItem>>(ENDPOINTS.COCINA.GET(id))
      return res.data
    },
    enabled: !!id,
  })
}
