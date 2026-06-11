import { useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/core/auth/store"
import { startConnection, stopConnection, on, off } from "@/lib/signalR"
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
          on("RecibirNotificacion", (notificacion: Notificacion) => {
            console.info("[SignalR] RecibirNotificacion recibida:", notificacion.tipo, notificacion.titulo)
            playSound(notifSound)
            const state = useNotificationStore.getState()
            state.setNotificaciones([notificacion, ...state.notificaciones])
            state.setUnread(state.unread + 1)
            queryClient.invalidateQueries({ queryKey: ["ordenes-por-mesero"] })
            queryClient.invalidateQueries({ queryKey: ["ordenes-por-mesa"] })
          }),
        )

        unsubs.push(
          on("RecibirNotificaciones", (notificaciones: Notificacion[]) => {
            console.info(`[SignalR] RecibirNotificaciones recibidas: ${notificaciones.length}`)
            useNotificationStore.getState().setNotificaciones(notificaciones)
            queryClient.invalidateQueries({ queryKey: ["notificaciones-no-leidas"] })
          }),
        )

        unsubs.push(
          on("ContadorActualizado", () => {
            console.info("[SignalR] ContadorActualizado recibido")
            queryClient.invalidateQueries({ queryKey: ["notificaciones-no-leidas"] })
          }),
        )

        unsubs.push(
          on("OrdenActualizada", () => {
            console.info("[SignalR] OrdenActualizada recibida — refrescando órdenes")
            queryClient.invalidateQueries({ queryKey: ["ordenes-por-mesero"] })
            queryClient.invalidateQueries({ queryKey: ["ordenes-por-mesa"] })
          }),
        )

        unsubs.push(
          on("ProductoActualizado", (payload: ProductoActualizadoPayload) => {
            console.info("[SignalR] ProductoActualizado:", payload.producto.estado, "-", payload.producto.itemMenuNombre ?? "(sin nombre)")
            const { ordenId, producto } = payload
            const updateCache = (old: Orden[] | undefined) => {
              if (!old) return old
              return old.map((o) =>
                o.id === ordenId
                  ? {
                      ...o,
                      productos: o.productos.map((p) =>
                        p.id === producto.id
                          ? { ...p, estado: producto.estado, enviadoEn: producto.enviadoEn, listoEn: producto.listoEn }
                          : p,
                      ),
                    }
                  : o,
              )
            }
            queryClient.setQueriesData<Orden[]>({ queryKey: ["ordenes-por-mesa"] }, updateCache)
            queryClient.setQueriesData<Orden[]>({ queryKey: ["ordenes-por-mesero"] }, updateCache)
            queryClient.setQueriesData<Orden>({ queryKey: ["orden"] }, (old) => {
              if (!old || old.id !== ordenId) return old
              return {
                ...old,
                productos: old.productos.map((p) =>
                  p.id === producto.id
                    ? { ...p, estado: producto.estado, enviadoEn: producto.enviadoEn, listoEn: producto.listoEn }
                    : p,
                ),
              }
            })
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
