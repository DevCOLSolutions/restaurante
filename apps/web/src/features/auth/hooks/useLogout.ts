import { BASE_URL } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)

  return () => {
    logout()
    localStorage.removeItem("rest2025-auth")
    localStorage.removeItem("rest2025-auth-token")

    fetch(`${BASE_URL}${ENDPOINTS.AUTH.LOGOUT}`, {
      method: "POST",
      credentials: "include",
      keepalive: true,
    }).catch(() => {})

    window.location.href = "/login"
  }
}
