import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, UsuarioItem } from "@/types/api"

interface SucursalUsuarioRaw {
  id: string
  userId: string
  nombre: string
  correo: string
  rol: string
  sucursalId: string
  sucursalNombre: string | null
  areaCocinaId: string | null
  activo: boolean
}

export function useUsuariosPorSucursal(sucursalId: string | undefined) {
  return useQuery({
    queryKey: ["usuarios-por-sucursal", sucursalId],
    queryFn: async () => {
      if (!sucursalId) return []
      const res = await apiFetch<ApiResponse<SucursalUsuarioRaw[]>>(ENDPOINTS.SUCURSALES.USUARIOS(sucursalId))
      const raw = res.data ?? []
      return raw.map((u): UsuarioItem => ({
        id: u.userId,
        email: u.correo,
        roles: [u.rol],
        name: u.nombre,
        username: u.correo,
        activo: u.activo,
      }))
    },
    enabled: !!sucursalId,
  })
}
