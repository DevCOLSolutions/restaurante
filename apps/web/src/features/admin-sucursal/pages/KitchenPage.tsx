import { useState } from "react"
import { Card, CardContent } from "@/shared/ui/Card"
import { Badge } from "@/shared/ui/Badge"
import { MetricCard } from "@/features/global-manager/components/MetricCard"
import { ChefHat, Clock } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { HeroAdministrador } from "@/features/global-manager/components/Hero"

interface KitchenArea { name: string; description: string }
const defaultKitchenAreas: KitchenArea[] = [
  { name: "Zona de cocción", description: "Área de cocción y preparación caliente" },
  { name: "Platos fríos", description: "Área de ensaladas y platos fríos" },
  { name: "Bebidas", description: "Área de bebidas y bar" },
]

interface KitchenItem { name: string; qty: number; category: string; area: string }
const kitchenOrders: { id: string; table: number; items: KitchenItem[]; status: string; time: string; priority: string }[] = [
  { id: "k1", table: 1, items: [{ name: "Tacos al Pastor", qty: 3, category: "P.FUERTE", area: "Zona de cocción" }, { name: "Guacamole", qty: 1, category: "ENTRADAS", area: "Platos fríos" }], status: "preparing", time: "10 min", priority: "urgent" },
  { id: "k2", table: 6, items: [{ name: "Hamburguesa Clásica", qty: 2, category: "P.FUERTE", area: "Zona de cocción" }, { name: "Papas Fritas", qty: 2, category: "ENTRADAS", area: "Zona de cocción" }], status: "pending", time: "15 min", priority: "normal" },
  { id: "k3", table: 2, items: [{ name: "Enchiladas Verdes", qty: 2, category: "P.FUERTE", area: "Zona de cocción" }], status: "pending", time: "20 min", priority: "normal" },
  { id: "k4", table: 3, items: [{ name: "Agua de Jamaica", qty: 2, category: "BEBIDAS", area: "Bebidas" }], status: "ready", time: "0 min", priority: "normal" },
]

export function KitchenPage() {
  const [activeArea, setActiveArea] = useState("Zona de cocción")
  const kitchenAreas = defaultKitchenAreas

  

  const filteredOrders = kitchenOrders.filter((o) => o.items.some((i) => i.area === activeArea))
  const pending = filteredOrders.filter((o) => o.status === "pending")
  const preparing = filteredOrders.filter((o) => o.status === "preparing")
  const ready = filteredOrders.filter((o) => o.status === "ready")

  return (
    <div className="space-y-4">
      <HeroAdministrador />
      <div className="px-4 space-y-4">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex gap-2 min-w-max pb-1">
            {kitchenAreas.map((area) => (
              <button key={area.name} onClick={() => setActiveArea(area.name)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeArea === area.name ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/20" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800"}`}>
                {area.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MetricCard title="Pendientes" value={pending.length} icon={<Clock size={20} />} />
          <MetricCard title="Preparando" value={preparing.length} icon={<ChefHat size={20} />} />
          <MetricCard title="Listos" value={ready.length} icon={<ChefHat size={20} />} />
        </div>

        {ready.length > 0 && (
          <div>
            <h2 className="mb-3 text-base font-semibold text-emerald-600">{activeArea} — Listos para Servir</h2>
            <div className="space-y-2">
              {ready.map((order) => (
                <Card key={order.id} className="border-emerald-200 bg-emerald-50/50">
                  <CardContent className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-900">Mesa {order.table}</span>
                      <p className="text-xs text-neutral-500">{order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</p>
                    </div>
                    <Badge variant="success">Listo</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {preparing.length > 0 && (
          <div>
            <h2 className="mb-3 text-base font-semibold text-amber-600">{activeArea} — En Preparación</h2>
            <div className="space-y-2">
              {preparing.map((order) => (
                <Card key={order.id} className="border-amber-200 bg-amber-50/50">
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-neutral-900">Mesa {order.table}</span>
                      <span className="text-xs text-amber-600 font-medium">{order.time}</span>
                    </div>
                    <p className="text-sm text-neutral-700 mb-2">{order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</p>
                    <Button className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white">Marcar como Listo</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
