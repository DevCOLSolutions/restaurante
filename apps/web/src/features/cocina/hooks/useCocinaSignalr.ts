import { useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/core/auth/store"
import { startConnection, stopConnection, on } from "@/lib/signalR"

export function useCocinaSignalr() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const sucursalId = useAuthStore((s) => s.user?.sucursalId)
  const queryClient = useQueryClient()
  const connectedRef = useRef(false)

  useEffect(() => {
    if (!isAuthenticated || !sucursalId) {
      if (connectedRef.current) {
        connectedRef.current = false
        stopConnection().catch(() => {})
      }
      return
    }

    if (connectedRef.current) return
    connectedRef.current = true

    const unsubs: (() => void)[] = []

    startConnection()
      .then(() => {
        unsubs.push(
          on("OrdenNueva", () => {
            console.info("[SignalR] OrdenNueva recibida")
            queryClient.invalidateQueries({ queryKey: ["cocina"] })
          }),
        )

        unsubs.push(
          on("ProductoActualizado", () => {
            console.info("[SignalR] ProductoActualizado recibido")
            queryClient.invalidateQueries({ queryKey: ["cocina"] })
          }),
        )
      })
      .catch((err) => {
        console.error("[SignalR] Error al conectar cocina:", err)
        connectedRef.current = false
      })

    return () => {
      unsubs.forEach((fn) => fn())
    }
  }, [isAuthenticated, sucursalId, queryClient])

  useEffect(() => {
    if (!isAuthenticated && connectedRef.current) {
      connectedRef.current = false
      stopConnection().catch(() => {})
    }
  }, [isAuthenticated])
}
