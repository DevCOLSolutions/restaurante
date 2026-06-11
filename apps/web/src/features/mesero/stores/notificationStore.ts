import { create } from "zustand"
import type { Notificacion } from "@/types/api"

interface NotificationStore {
  open: boolean
  notificaciones: Notificacion[]
  unread: number
  setOpen: (open: boolean) => void
  toggle: () => void
  setNotificaciones: (notificaciones: Notificacion[]) => void
  setUnread: (count: number) => void
  markRead: (id: string) => void
  markAllRead: () => void
  remove: (id: string) => void
  unreadCount: () => number
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  open: false,
  notificaciones: [],
  unread: 0,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
  setNotificaciones: (notificaciones) => set({ notificaciones }),
  setUnread: (count) => set({ unread: count }),
  markRead: (id) =>
    set((s) => ({
      notificaciones: s.notificaciones.map((n) =>
        n.id === id ? { ...n, leida: true } : n
      ),
      unread: Math.max(0, s.unread - 1),
    })),
  markAllRead: () =>
    set((s) => ({
      notificaciones: s.notificaciones.map((n) => ({ ...n, leida: true })),
      unread: 0,
    })),
  remove: (id) =>
    set((s) => ({
      notificaciones: s.notificaciones.filter((n) => n.id !== id),
    })),
  unreadCount: () => get().unread,
}))
