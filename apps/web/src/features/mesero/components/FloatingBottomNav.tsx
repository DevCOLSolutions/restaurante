import { useState } from "react"
import { cn } from "@/shared/lib/utils"
import { NavLink, useLocation } from "react-router-dom"
import { Plus, HouseHeart, UtensilsCrossed, ClipboardList, User, Minus, ShoppingCart, ArrowLeft } from "lucide-react"
import { formatCurrency } from "@/core/utils"
import { Input } from "@/shared/ui/Input"
import { Button } from "@workspace/ui/components/button"

const navItems = [
  { icon: <HouseHeart size={22} />, href: "/app/mesero" },
  { icon: <UtensilsCrossed size={22} />, href: "/app/mesero/tables" },
  { isFab: true },
  { icon: <ClipboardList size={22} />, href: "/app/mesero/orders" },
  { icon: <User size={22} />, href: "/app/mesero/profile" },
]

const menuItems = [
  { id: "m1", name: "Tacos al Pastor", price: 45, category: "Platillos" },
  { id: "m2", name: "Guacamole", price: 65, category: "Entradas" },
  { id: "m3", name: "Enchiladas Verdes", price: 85, category: "Platillos" },
  { id: "m4", name: "Hamburguesa Clásica", price: 120, category: "Platillos" },
  { id: "m5", name: "Agua de Jamaica", price: 25, category: "Bebidas" },
  { id: "m6", name: "Malteada de Vainilla", price: 45, category: "Bebidas" },
  { id: "m7", name: "Papas Fritas", price: 55, category: "Entradas" },
  { id: "m8", name: "Ensalada César", price: 95, category: "Entradas" },
]

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export function FloatingBottomNav() {
  const pathname = useLocation().pathname
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedTable, setSelectedTable] = useState("")
  const [notes, setNotes] = useState("")

  const addToCart = (item: (typeof menuItems)[0]) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id)
      if (existing && existing.quantity > 1) {
        return prev.map((c) => (c.id === id ? { ...c, quantity: c.quantity - 1 } : c))
      }
      return prev.filter((c) => c.id !== id)
    })
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const openDrawer = () => {
    setDrawerOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    document.body.style.overflow = ""
  }

  return (
    <>
      {/* Bottom bar */}
      <nav className="fixed  bottom-0 left-0 right-0 z-40 border-t border-neutral-200/70 bg-[#F6F7FB] pb-1 pt-2 shadow-lg backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center">
          {navItems.map((item, i) => {
            const isActive = !item.isFab && pathname === item.href

            if (item.isFab) {
              return (
                <button
                  key={i}
                  onClick={openDrawer}
                  className="flex flex-1 flex-col items-center py-2"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-all duration-200 hover:bg-neutral-800 active:scale-95">
                    <Plus size={22} strokeWidth={2.5} />
                  </span>
                </button>
              )
            }

            if (!item.href) return null
            return (
              <NavLink
                key={i}
                to={item.href}
                className="relative flex flex-1 flex-col items-center py-1"
              >
                <span className={cn("transition-colors", isActive ? "text-neutral-900" : "text-gray-600/30")}>
                  {item.icon}
                </span>
                {isActive && (
                  <span className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-neutral-900" />
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeDrawer} />
          <div className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-2xl border border-neutral-200 bg-white p-5 pb-8 shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Nueva Orden</h2>
              <button
                onClick={closeDrawer}
                className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedTable(String(num))}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedTable === String(num)
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  Mesa {num}
                </button>
              ))}
            </div>

            <div className="mb-4 space-y-2">
              {menuItems.map((item) => {
                return (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-neutral-800">{item.name}</p>
                      <p className="text-xs text-neutral-500">{item.category}</p>
                      <p className="text-sm font-bold text-neutral-900 mt-0.5">{formatCurrency(item.price)}</p>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                )
              })}
            </div>

            {cart.length > 0 && (
              <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-800">Carrito</span>
                  <span className="text-sm font-bold text-neutral-900">{formatCurrency(total)}</span>
                </div>
                <div className="max-h-32 space-y-1.5 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-700">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-neutral-600">
                          <Minus size={14} />
                        </button>
                        <span className="w-5 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, category: "" })}
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          <Plus size={14} />
                        </button>
                        <span className="w-14 text-right font-medium text-neutral-800">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Input
                  placeholder="Notas para la cocina..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Button className="w-full rounded-xl" disabled={!selectedTable || cart.length === 0}>
                  <ShoppingCart size={16} className="mr-2" />
                  Enviar Orden - Mesa {selectedTable || "—"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
