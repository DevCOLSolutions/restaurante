import { useState } from "react"
import { cn } from "@/shared/lib/utils"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Plus, HouseHeart, UtensilsCrossed, ClipboardList, User, Users } from "lucide-react"
import { useMesas } from "@/features/global-manager/hooks/useMesas"

const navItems = [
  { icon: <HouseHeart size={22} />, href: "/app/mesero", label: "Inicio" },
  { icon: <UtensilsCrossed size={22} />, href: "/app/mesero/tables", label: "Mesas" },
  { isFab: true },
  { icon: <ClipboardList size={22} />, href: "/app/mesero/orders", label: "Órdenes" },
  { icon: <User size={22} />, href: "/app/mesero/profile", label: "Perfil" },
]

export function FloatingBottomNav() {
  const pathname = useLocation().pathname
  const navigate = useNavigate()
  const { data: mesas } = useMesas()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const disponibles = mesas?.filter((m) => m.estado === "disponible") ?? []

  const openDrawer = () => {
    setDrawerOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    document.body.style.overflow = ""
  }

  const selectTable = (mesa: (typeof disponibles)[number]) => {
    closeDrawer()
    navigate("/app/mesero/order-create", { state: { mesa } })
  }

  return (
    <>
      {/* Bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200/70 bg-[#F6F7FB] pb-1 pt-2 shadow-lg backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center">
          {navItems.map((item, i) => {
            const isActive = !item.isFab && pathname === item.href

            if (item.isFab) {
              return (
                <button
                  key={i}
                  onClick={openDrawer}
                  className="flex flex-1 flex-col items-center py-1 gap-0.5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-all duration-200 hover:bg-neutral-800 active:scale-95">
                    <Plus size={22} strokeWidth={2.5} />
                  </span>
                  <span className="text-[10px] text-neutral-500">Orden</span>
                </button>
              )
            }

            if (!item.href) return null
            return (
              <NavLink
                key={i}
                to={item.href}
                className="relative flex flex-1 flex-col items-center py-1 gap-0.5"
              >
                <span className={cn("transition-colors", isActive ? "text-neutral-900" : "text-gray-600/30")}>
                  {item.icon}
                </span>
                <span className={cn("text-[10px]", isActive ? "text-neutral-900 font-medium" : "text-gray-400")}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-neutral-900" />
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Drawer — seleccionar mesa */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeDrawer} />
          <div className="relative z-10 max-h-[70vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-8 shadow-2xl" style={{ animation: "slideUp 0.25s ease-out" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-base font-semibold text-neutral-900">Nueva orden</p>
                <p className="text-sm text-neutral-500">{disponibles.length} mesas disponibles</p>
              </div>
              <button onClick={closeDrawer} className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 transition-colors">
                <Plus size={20} className="rotate-45" />
              </button>
            </div>

            <div className="space-y-2">
              {disponibles.map((mesa) => (
                <div
                  key={mesa.id}
                  className="flex items-center gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/40 px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-900">Mesa {String(mesa.numero).padStart(2, "0")}</span>
                      <span className="text-xs text-neutral-400">— {mesa.nombre}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                        <Users size={11} />
                        {mesa.capacidad} {mesa.capacidad === 1 ? "persona" : "personas"}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Disponible
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => selectTable(mesa)}
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                  >
                    <Plus size={13} />
                    Tomar pedido
                  </button>
                </div>
              ))}

              {disponibles.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-sm font-medium text-neutral-500">No hay mesas disponibles</p>
                  <p className="text-xs text-neutral-400 mt-1">Todas las mesas están ocupadas o reservadas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </>
  )
}
