import { Outlet } from "react-router-dom"
import { Sidebar } from "@/shared/components/Sidebar"
import { BottomNavigation } from "@/shared/components/BottomNavigation"
import { useIsMobile } from "@/shared/hooks/useMediaQuery"
import { cn } from "@/shared/lib/utils"
import { cocinaNavItems } from "../navigation"
import { cocinaMobileNav } from "../navigation/mobile"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { useAuthStore } from "@/core/auth/store"
import { ChefHat, LogOut } from "lucide-react"

export function CocinaLayout() {
  const isMobile = useIsMobile()
  const logout = useLogout()
  const user = useAuthStore((s) => s.user)

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {!isMobile && (
        <Sidebar
          items={cocinaNavItems}
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
        <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur-lg">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500">
                <ChefHat size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-neutral-900 leading-tight">Cocina</h1>
                {user && <p className="text-xs text-neutral-500 leading-tight">{user.name}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <span className="hidden sm:block text-sm text-neutral-500">{user.email}</span>
              )}
              <button
                onClick={logout}
                className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>
        <div className="p-4">
          <Outlet />
        </div>
      </main>
      {isMobile && <BottomNavigation items={cocinaMobileNav} />}
    </div>
  )
}
