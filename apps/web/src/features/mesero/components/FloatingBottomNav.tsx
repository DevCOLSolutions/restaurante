import { useState } from "react"
import { cn } from "@/shared/lib/utils"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Plus, HouseHeart, UtensilsCrossed, ClipboardList, User, Table2 } from "lucide-react"

const navItems = [
  { icon: <HouseHeart size={22} />, href: "/app/mesero", label: "Inicio" },
  { icon: <UtensilsCrossed size={22} />, href: "/app/mesero/tables", label: "Mesas" },
  { isFab: true },
  { icon: <ClipboardList size={22} />, href: "/app/mesero/orders", label: "Órdenes" },
  { icon: <User size={22} />, href: "/app/mesero/profile", label: "Perfil" },
]

const tables = [
  { number: 1, people: 2, status: "libre" }, { number: 2, people: 4, status: "ocupada" }, { number: 3, people: 6, status: "libre" },
  { number: 4, people: 2, status: "libre" }, { number: 5, people: 4, status: "ocupada" }, { number: 6, people: 2, status: "ocupada" },
  { number: 7, people: 8, status: "libre" }, { number: 8, people: 4, status: "ocupada" }, { number: 9, people: 2, status: "reservada" },
  { number: 10, people: 1, status: "libre" }, { number: 11, people: 4, status: "libre" }, { number: 12, people: 2, status: "ocupada" },
]

export function FloatingBottomNav() {
  const pathname = useLocation().pathname
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openDrawer = () => {
    setDrawerOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    document.body.style.overflow = ""
  }

  const selectTable = (number: number, people: number) => {
    closeDrawer()
    navigate("/app/mesero/order-create", { state: { table: number, people } })
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

      {/* Drawer - select table */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeDrawer} />
          <div className="relative z-10 max-h-[70vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-8 shadow-2xl" style={{ animation: "slideUp 0.25s ease-out" }}>
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Nueva orden</h2>
              <button onClick={closeDrawer} className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 transition-colors">
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            <p className="text-sm text-neutral-500 mb-4">Mesas disponibles ({tables.filter((t) => t.status === "libre").length})</p>
            <div className="grid grid-cols-3 gap-2">
              {tables.filter((t) => t.status === "libre").map((t) => (
                <button
                  key={t.number}
                  onClick={() => selectTable(t.number, t.people)}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-3 hover:border-neutral-400 hover:bg-neutral-50 active:scale-95 transition-all"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 text-neutral-600">
                    <Table2 size={15} />
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">Mesa {String(t.number).padStart(2, "0")}</span>
                  <span className="text-[10px] text-neutral-400">{t.people} {t.people === 1 ? "persona" : "personas"}</span>
                </button>
              ))}
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