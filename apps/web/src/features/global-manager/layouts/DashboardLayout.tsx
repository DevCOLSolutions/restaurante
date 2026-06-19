import { useEffect, useMemo } from "react"
import { Outlet } from "react-router-dom"
import { Building2, House, UtensilsCrossed, Store } from "lucide-react"
import { Sidebar } from "@/shared/components/Sidebar"
import { BottomNavigation } from "@/shared/components/BottomNavigation"
import { useIsMobile } from "@/shared/hooks/useMediaQuery"
import { cn } from "@/shared/lib/utils"
import { useAuthStore } from "@/core/auth/store"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { useSucursalStore } from "../store/sucursalStore"

export function GlobalManagerLayout() {
  const isMobile = useIsMobile()
  const logout = useLogout()
  const hydrate = useSucursalStore((s) => s._hydrate)
  const user = useAuthStore((s) => s.user)
  const tieneAdminSucursal = user?.roles?.includes("AdminSucursal")

  useEffect(() => { hydrate() }, [hydrate])

  const globalManagerNavItems = useMemo(() => {
    const items = [
      { icon: <House size={20} />, label: "Inicio", href: "/app/global-manager", end: true },
      { icon: <Building2 size={20} />, label: "Sucursales", href: "/app/global-manager/sucursales" },
      { icon: <UtensilsCrossed size={20} />, label: "Menú", href: "/app/global-manager/menu" },
    ]
    if (tieneAdminSucursal) {
      items.push({ icon: <Store size={20} />, label: "Modo sucursal", href: "/app/admin-sucursal" })
    }
    return items
  }, [tieneAdminSucursal])

  const globalManagerMobileNav = useMemo(() => {
    const items = [
      { icon: <House size={22} />, label: "Inicio", href: "/app/global-manager", end: true },
      { icon: <Building2 size={22} />, label: "Sucursales", href: "/app/global-manager/sucursales" },
      { icon: <UtensilsCrossed size={22} />, label: "Menú", href: "/app/global-manager/menu" },
    ]
    if (tieneAdminSucursal) {
      items.push({ icon: <Store size={22} />, label: "Modo sucursal", href: "/app/admin-sucursal" })
    }
    return items
  }, [tieneAdminSucursal])

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {!isMobile && (
        <Sidebar
          items={globalManagerNavItems}
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
      {isMobile && <BottomNavigation items={globalManagerMobileNav} />}
    </div>
  )
}
