import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse } from "@/types/api"

export interface UsuarioRaw {
  id: string
  userId: string
  nombre: string
  correo: string
  rol: string
  roles: string[]
  sucursalId: string
  sucursalNombre: string | null
  areaCocinaId: string | null
  activo: boolean
  creadoEn: string
  actualizadoEn: string | null
}

export function useUsuario(userId: string | undefined) {
  return useQuery({
    queryKey: ["usuario", userId],
    queryFn: async () => {
      if (!userId) return null
      const res = await apiFetch<ApiResponse<UsuarioRaw>>(ENDPOINTS.USUARIOS.GET(userId))
      return res.data
    },
    enabled: !!userId,
  })
}
