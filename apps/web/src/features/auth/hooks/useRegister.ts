import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { apiFetch, BASE_URL } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"
import { getDashboardPathForRole } from "@/core/auth/utils"
import type { UserRole } from "@/core/auth/types"

interface RegisterRequest {
  username: string
  email: string
  password: string
  fullName: string | null
}

export function useRegister() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      apiFetch<unknown>(ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: async () => {
      const res = await fetch(`${BASE_URL}/auth/me`, { credentials: "include" })
      if (!res.ok) {
        navigate("/login", { replace: true })
        return
      }
      const body = await res.json()
      const u = body.data

      login(
        {
          id: u.userId,
          name: u.fullName,
          email: u.email,
          role: u.role,
          roles: u.roles ?? [u.role],
          restaurantId: u.restauranteId,
          sucursalId: u.sucursalId,
        },
        body.expiresAt,
      )

      queryClient.invalidateQueries({ queryKey: ["me"] })
      navigate(getDashboardPathForRole(u.role as UserRole), { replace: true })
    },
  })
}
