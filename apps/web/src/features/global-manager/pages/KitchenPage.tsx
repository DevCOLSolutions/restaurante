import { Card, CardContent } from "@/shared/ui/Card"
import { Badge } from "@/shared/ui/Badge"
import { MetricCard } from "@/features/global-manager/components/MetricCard"
import { ChefHat, Clock } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

const kitchenOrders = [
  { id: "k1", table: 1, items: [{ name: "Tacos al Pastor", qty: 3 }, { name: "Guacamole", qty: 1 }], status: "preparing", time: "10 min", priority: "urgent" as const },
  { id: "k2", table: 6, items: [{ name: "Hamburguesa Clásica", qty: 2 }, { name: "Papas Fritas", qty: 2 }], status: "pending", time: "15 min", priority: "normal" as const },
  { id: "k3", table: 2, items: [{ name: "Enchiladas Verdes", qty: 2 }], status: "pending", time: "20 min", priority: "normal" as const },
  { id: "k4", table: 3, items: [{ name: "Agua de Jamaica", qty: 2 }], status: "ready", time: "0 min", priority: "normal" as const },
]

export function KitchenPage() {
  const pending = kitchenOrders.filter((o) => o.status === "pending")
  const preparing = kitchenOrders.filter((o) => o.status === "preparing")
  const ready = kitchenOrders.filter((o) => o.status === "ready")

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Cocina</h1>
        <p className="text-sm text-neutral-500">Todas las órdenes de cocina</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MetricCard title="Pendientes" value={pending.length} icon={<Clock size={20} />} />
        <MetricCard title="Preparando" value={preparing.length} icon={<ChefHat size={20} />} />
        <MetricCard title="Listos" value={ready.length} icon={<ChefHat size={20} />} />
      </div>

      {ready.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-semibold text-emerald-600">Listos para Servir</h2>
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
          <h2 className="mb-3 text-base font-semibold text-amber-600">En Preparación</h2>
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

      <div>
        <h2 className="mb-3 text-base font-semibold text-neutral-800">Pendientes ({pending.length})</h2>
        <div className="space-y-2">
          {pending.map((order) => (
            <Card key={order.id}>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-neutral-900">Mesa {order.table}</span>
                  <span className="text-xs text-neutral-500">{order.time}</span>
                </div>
                <p className="text-sm text-neutral-700 mb-2">{order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</p>
                <Button className="w-full rounded-xl">Iniciar Preparación</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
