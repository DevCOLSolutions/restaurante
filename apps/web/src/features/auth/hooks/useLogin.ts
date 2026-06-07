import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"
import { getDashboardPathForRole } from "@/core/auth/utils"
import type { ApiResponse, LoginData, LoginRequest } from "@/types/api"

export function useLogin() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginRequest) =>
      apiFetch<ApiResponse<LoginData>>(ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (response) => {
      const loginData = response.data
      if (!loginData) return

      const apiUser = loginData.user

      login({
        id: apiUser.userId,
        name: apiUser.username,
        email: apiUser.username,
        role: apiUser.role,
        restaurantId: apiUser.restauranteId,
        sucursalId: apiUser.sucursalId,
      })

      queryClient.invalidateQueries({ queryKey: ["me"] })
      navigate(getDashboardPathForRole(apiUser.role as any), { replace: true })
    },
  })
}
