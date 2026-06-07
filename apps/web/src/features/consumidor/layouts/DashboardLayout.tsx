import { Outlet } from "react-router-dom"
import { Sidebar } from "@/shared/components/Sidebar"
import { BottomNavigation } from "@/shared/components/BottomNavigation"
import { useIsMobile } from "@/shared/hooks/useMediaQuery"
import { cn } from "@/shared/lib/utils"
import { consumidorNavItems } from "../navigation"
import { consumidorMobileNav } from "../navigation/mobile"
import { useLogout } from "@/features/auth/hooks/useLogout"

export function ConsumidorLayout() {
  const isMobile = useIsMobile()
  const logout = useLogout()

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {!isMobile && (
        <Sidebar
          items={consumidorNavItems}
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
      <main className={cn("flex-1 min-w-0", isMobile && "pb-20")}>
        <Outlet />
      </main>
      {isMobile && <BottomNavigation items={consumidorMobileNav} />}
    </div>
  )
}
