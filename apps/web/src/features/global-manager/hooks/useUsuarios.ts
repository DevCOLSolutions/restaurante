import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse, UsuarioItem } from "@/types/api"

interface UsuarioGeneralRaw {
  id: string
  nombre?: string
  name?: string
  correo?: string
  email?: string
  roles?: string[]
  role?: string
  username?: string
}

export function useUsuarios() {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const res = await apiFetch<ApiResponse<UsuarioGeneralRaw[]>>(ENDPOINTS.USUARIOS.LIST)
      const raw = res.data ?? []
      return raw.map((u): UsuarioItem => ({
        id: u.id,
        email: u.correo ?? u.email ?? "",
        roles: u.roles ?? (u.role ? [u.role] : []),
        name: u.nombre ?? u.name,
        username: u.username ?? u.correo ?? u.email,
      }))
    },
  })
}
