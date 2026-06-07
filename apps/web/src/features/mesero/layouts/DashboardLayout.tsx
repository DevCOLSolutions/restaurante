import { Outlet } from "react-router-dom"
import { Sidebar } from "@/shared/components/Sidebar"
import { useIsMobile } from "@/shared/hooks/useMediaQuery"
import { cn } from "@/shared/lib/utils"
import { meseroNavItems } from "../navigation"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { FloatingBottomNav } from "../components/FloatingBottomNav"
import { NotificationDrawer } from "../components/NotificationDrawer"

export function MeseroLayout() {
  const isMobile = useIsMobile()
  const logout = useLogout()
  

  return (
    <div className="flex min-h-screen bg-white">
      {!isMobile && (
        <Sidebar
          items={meseroNavItems}
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
    </div>
  )
}
