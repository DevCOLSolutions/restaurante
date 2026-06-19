import { useMemo } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "@/shared/components/Sidebar"
import { BottomNavigation } from "@/shared/components/BottomNavigation"
import { useIsMobile } from "@/shared/hooks/useMediaQuery"
import { cn } from "@/shared/lib/utils"
import { Building2, Grid3x3, FileClock, Users, ChefHat } from "lucide-react"
import { useAuthStore } from "@/core/auth/store"
import { useLogout } from "@/features/auth/hooks/useLogout"

export function AdminSucursalLayout() {
  const isMobile = useIsMobile()
  const logout = useLogout()
  const user = useAuthStore((s) => s.user)
  const tieneGlobalManager = user?.roles?.includes("GlobalManager")

  const adminSucursalNavItems = useMemo(() => {
    const items = [
      { icon: <Grid3x3 size={20} />, label: "Mesas", href: "/app/admin-sucursal", end: true },
      { icon: <FileClock size={20} />, label: "Órdenes", href: "/app/admin-sucursal/orders" },
      { icon: <Users size={20} />, label: "Meseros", href: "/app/admin-sucursal/meseros" },
      { icon: <ChefHat size={20} />, label: "Cocina", href: "/app/admin-sucursal/kitchen" },
    ]
    if (tieneGlobalManager) {
      items.unshift({ icon: <Building2 size={20} />, label: "Admin global", href: "/app/global-manager" })
    }
    return items
  }, [tieneGlobalManager])

  const adminSucursalMobileNav = useMemo(() => {
    const items = [
      { icon: <Grid3x3 size={22} />, label: "Mesas", href: "/app/admin-sucursal", end: true },
      { icon: <FileClock size={22} />, label: "Órdenes", href: "/app/admin-sucursal/orders" },
      { icon: <Users size={22} />, label: "Meseros", href: "/app/admin-sucursal/meseros" },
      { icon: <ChefHat size={22} />, label: "Cocina", href: "/app/admin-sucursal/kitchen" },
    ]
    if (tieneGlobalManager) {
      items.unshift({ icon: <Building2 size={22} />, label: "Admin global", href: "/app/global-manager" })
    }
    return items
  }, [tieneGlobalManager])

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {!isMobile && (
        <Sidebar
          items={adminSucursalNavItems}
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
      {isMobile && <BottomNavigation items={adminSucursalMobileNav} />}
    </div>
  )
}
