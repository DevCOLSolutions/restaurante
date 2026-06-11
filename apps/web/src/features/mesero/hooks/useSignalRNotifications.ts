import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/core/auth/store"
import { startConnection, stopConnection, on } from "@/lib/signalR"
import { useNotificationStore } from "../stores/notificationStore"
import type { Notificacion, ProductoActualizadoPayload, Orden } from "@/types/api"
import { playSound } from "@/lib/audio"
import notifSound from "@/assets/notificaicotion_sound.mp3"

export function useSignalRNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const sucursalId = useAuthStore((s) => s.user?.sucursalId)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isAuthenticated || !sucursalId) {
      stopConnection().catch(() => {})
      return
    }

    const unsubs: (() => void)[] = []
    let cancelled = false

    startConnection()
      .then(() => {
        if (cancelled) return

        unsubs.push(
          on("RecibirNotificacion", (args: unknown) => {
            const notificacion = args as Notificacion
            console.info("[SignalR] RecibirNotificacion:", notificacion.tipo, notificacion.titulo)
            playSound(notifSound)
            useNotificationStore.getState().setUnread(
              useNotificationStore.getState().unread + 1,
            )
            queryClient.invalidateQueries({ queryKey: ["notificaciones"] })
          }),
        )

        unsubs.push(
          on("RecibirNotificaciones", (args: unknown) => {
            const notificaciones = args as Notificacion[]
            console.info(`[SignalR] RecibirNotificaciones: ${notificaciones.length}`)
            queryClient.invalidateQueries({ queryKey: ["notificaciones"] })
            queryClient.invalidateQueries({ queryKey: ["notificaciones-no-leidas"] })
          }),
        )

        unsubs.push(
          on("ContadorActualizado", () => {
            queryClient.invalidateQueries({ queryKey: ["notificaciones-no-leidas"] })
          }),
        )

        unsubs.push(
          on("OrdenNueva", (args: unknown) => {
            const orden = args as Orden
            console.info("[SignalR] OrdenNueva #", orden.numeroOrden)
            queryClient.setQueryData<Orden[]>(["ordenes-mi-area"], (old) =>
              old ? [orden, ...old] : [orden],
            )
            queryClient.invalidateQueries({ queryKey: ["ordenes-abiertas"] })
          }),
        )

        unsubs.push(
          on("ProductoActualizado", (args: unknown) => {
            const payload = args as ProductoActualizadoPayload
            console.info("[SignalR] ProductoActualizado:", payload.producto.estado)
            const { ordenId, producto } = payload

            const updateOrden = (old: Orden | undefined): Orden | undefined => {
              if (!old || old.id !== ordenId) return old
              return {
                ...old,
                productos: old.productos.map((p) =>
                  p.id === producto.id ? { ...p, estado: producto.estado, enviadoEn: producto.enviadoEn, listoEn: producto.listoEn } : p,
                ),
              }
            }

            const updateList = (old: Orden[] | undefined) => {
              if (!old) return old
              return old.map((o) => (o.id === ordenId ? updateOrden(o) ?? o : o))
            }

            queryClient.setQueriesData<Orden[]>({ queryKey: ["ordenes"] }, updateList)
            queryClient.setQueriesData<Orden>({ queryKey: ["orden", ordenId] }, updateOrden)
          }),
        )
      })
      .catch((err) => console.error("[SignalR] Error al iniciar conexión:", err))

    return () => {
      cancelled = true
      unsubs.forEach((fn) => fn())
    }
  }, [isAuthenticated, sucursalId, queryClient])
}