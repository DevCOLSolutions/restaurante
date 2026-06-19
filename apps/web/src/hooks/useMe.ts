import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"

export interface MeUser {
  userId: string
  username: string
  email: string
  fullName: string
  role: string
  roles: string[]
  restauranteId: string
  restauranteNombre: string
  sucursalId: string
  sucursalNombre: string
}

interface MeResponse {
  data: MeUser
}

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      if (!isAuthenticated) return null
      const res = await apiFetch<MeResponse>(ENDPOINTS.AUTH.ME)
      return res
    },
    staleTime: Infinity,
    retry: false,
    enabled: isAuthenticated,
  })
}
