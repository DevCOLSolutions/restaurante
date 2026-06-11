import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { Plus } from "lucide-react"
import { Sidebar } from "@/shared/components/Sidebar"
import { useIsMobile } from "@/shared/hooks/useMediaQuery"
import { cn } from "@/shared/lib/utils"
import { meseroNavItems } from "../navigation"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { FloatingBottomNav } from "../components/FloatingBottomNav"
import { NotificationDrawer } from "../components/NotificationDrawer"
import { TableDrawer } from "../tables/components/TableDrawer"
import { useNotificaciones } from "../hooks/useNotificaciones"
import { useNotificacionesNoLeidas } from "../hooks/useNotificacionesNoLeidas"
import { useSignalRNotifications } from "../hooks/useSignalRNotifications"
import { useNotificationStore } from "../stores/notificationStore"

export function MeseroLayout() {
  const isMobile = useIsMobile()
  const logout = useLogout()
  const [showOrderDrawer, setShowOrderDrawer] = useState(false)
  const { data: notificaciones } = useNotificaciones()
  const { data: unread } = useNotificacionesNoLeidas()
  const setNotificaciones = useNotificationStore((s) => s.setNotificaciones)
  const setUnread = useNotificationStore((s) => s.setUnread)

  useSignalRNotifications()

  useEffect(() => {
    if (notificaciones) setNotificaciones(notificaciones)
  }, [notificaciones, setNotificaciones])

  useEffect(() => {
    if (unread !== undefined) setUnread(unread)
  }, [unread, setUnread])

  return (
    <div className="flex min-h-screen bg-white">
      {!isMobile && (
        <Sidebar
          items={[
            ...meseroNavItems,
            {
              icon: <Plus size={20} />,
              label: "Nueva orden",
              href: "#",
              onClick: () => setShowOrderDrawer(true),
            },
          ]}
          bottomItems={[
            {
              icon: <span className="text-sm">⚙</span>,
              label: "Salir",
              href: "/login",
              onClick: logout,
            },
          ]}
        />
      )}
      <main className={cn("flex-1 min-w-0", isMobile && "pb-24")}>
        <Outlet />
      </main>
      {isMobile && <FloatingBottomNav />}
      <NotificationDrawer />

      {showOrderDrawer && (
        <TableDrawer onClose={() => setShowOrderDrawer(false)} />
      )}
    </div>
  )
}
