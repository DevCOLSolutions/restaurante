import { Card, CardContent } from "@/shared/ui/Card"
import { Badge } from "@/shared/ui/Badge"
import { HeroMesero } from "@/features/global-manager/components/Hero"
import { useAuthStore } from "@/core/auth/store"
import { Clock, ChefHat } from "lucide-react"

interface KitchenItem { name: string; qty: number; category: string; area: string }
interface KitchenOrder { id: string; table: number; items: KitchenItem[]; status: string; time: string; priority: string }

const pendingOrders: KitchenOrder[] = [
  { id: "k2", table: 6, items: [{ name: "Hamburguesa Clásica", qty: 2, category: "P.FUERTE", area: "Zona de cocción" }, { name: "Papas Fritas", qty: 2, category: "ENTRADAS", area: "Zona de cocción" }], status: "pending", time: "15 min", priority: "normal" },
  { id: "k3", table: 2, items: [{ name: "Enchiladas Verdes", qty: 2, category: "P.FUERTE", area: "Zona de cocción" }], status: "pending", time: "20 min", priority: "normal" },
  { id: "k5", table: 5, items: [{ name: "Tacos de Canasta", qty: 4, category: "P.FUERTE", area: "Zona de cocción" }, { name: "Agua de Horchata", qty: 2, category: "BEBIDAS", area: "Bebidas" }], status: "pending", time: "25 min", priority: "normal" },
  { id: "k6", table: 8, items: [{ name: "Ceviche", qty: 1, category: "ENTRADAS", area: "Platos fríos" }], status: "pending", time: "10 min", priority: "urgent" },
]

export function OrdersPage() {
  const user = useAuthStore((s) => s.user)
  const name = user?.name ?? "Administrador"
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  const urgent = pendingOrders.filter((o) => o.priority === "urgent")
  const normal = pendingOrders.filter((o) => o.priority === "normal")

  return (
    <div className="space-y-4">
      <HeroMesero nombre={name} initials={initials} />
      <div className="px-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="flex items-center gap-3 py-3">
              <div className="rounded-full bg-amber-100 p-2">
                <Clock size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Pendientes</p>
                <p className="text-xl font-bold text-neutral-900">{pendingOrders.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-3">
              <div className="rounded-full bg-red-100 p-2">
                <ChefHat size={18} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Urgentes</p>
                <p className="text-xl font-bold text-neutral-900">{urgent.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {urgent.length > 0 && (
          <div>
            <h2 className="mb-3 text-base font-semibold text-red-600">Urgentes</h2>
            <div className="space-y-2">
              {urgent.map((order) => (
                <Card key={order.id} className="border-red-200 bg-red-50/50">
                  <CardContent className="py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-neutral-900">Mesa {order.table}</span>
                      <Badge variant="danger">{order.time}</Badge>
                    </div>
                    <p className="text-sm text-neutral-700">{order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-3 text-base font-semibold text-neutral-800">Órdenes Pendientes ({normal.length})</h2>
          <div className="space-y-2">
            {normal.map((order) => (
              <Card key={order.id}>
                <CardContent className="py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-neutral-900">Mesa {order.table}</span>
                    <span className="text-xs text-neutral-500">{order.time}</span>
                  </div>
                  <p className="text-sm text-neutral-700">{order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</p>
                  <div className="flex gap-1.5 mt-2">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">{item.area}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
