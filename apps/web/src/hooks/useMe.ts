import { useQuery } from "@tanstack/react-query"
import { BASE_URL } from "@/lib/apiClient"

export interface MeUser {
  userId: string
  username: string
  email: string
  fullName: string
  role: string
  restauranteId: string
  restauranteNombre: string
  sucursalId: string
  sucursalNombre: string
}

interface MeResponse {
  data: MeUser
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        credentials: "include",
      })
      if (!res.ok) return null
      return res.json() as Promise<MeResponse>
    },
    staleTime: Infinity,
    retry: false,
  })
}
