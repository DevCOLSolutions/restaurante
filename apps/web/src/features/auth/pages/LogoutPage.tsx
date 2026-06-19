import { useEffect, useRef } from "react"
import { Navigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import { useAuthStore } from "@/core/auth/store"

export function LogoutPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient()
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true

    apiFetch(ENDPOINTS.AUTH.LOGOUT, { method: "POST" }).catch(() => {})

    logout()

    queryClient.removeQueries({ queryKey: ["me"] })
    queryClient.clear()

    localStorage.removeItem("rest2025-auth")
  }, [logout, queryClient])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return null
}
