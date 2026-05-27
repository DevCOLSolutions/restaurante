import { create } from "zustand"

export interface Notification {
  id: string
  type: "order_ready" | "order_sent" | "order_cancelled" | "info"
  title: string
  description: string
  tableNumber?: number
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  { id: "n1", type: "order_ready", title: "Orden lista", description: "Los platillos de la mesa 08 están listos para entregar", tableNumber: 8, time: "Hace 1 min", read: false },
  { id: "n2", type: "order_sent", title: "Orden enviada", description: "La orden de la mesa 05 se envió a cocina", tableNumber: 5, time: "Hace 5 min", read: false },
  { id: "n3", type: "info", title: "Adición a la orden", description: "Se agregaron productos a la mesa 03", tableNumber: 3, time: "Hace 8 min", read: false },
  { id: "n4", type: "order_cancelled", title: "Producto cancelado", description: "Un cliente canceló un artículo de la mesa 02", tableNumber: 2, time: "Hace 15 min", read: false },
  { id: "n5", type: "order_ready", title: "Orden lista", description: "Los platillos de la mesa 06 están listos para entregar", tableNumber: 6, time: "Hace 20 min", read: true },
  { id: "n6", type: "order_sent", title: "Orden enviada", description: "La orden de la mesa 10 se envió a cocina", tableNumber: 10, time: "Hace 30 min", read: true },
]

interface NotificationStore {
  open: boolean
  notifications: Notification[]
  setOpen: (open: boolean) => void
  toggle: () => void
  markRead: (id: string) => void
  markAllRead: () => void
  remove: (id: string) => void
  unreadCount: () => number
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  open: false,
  notifications: mockNotifications,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),
  remove: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}))