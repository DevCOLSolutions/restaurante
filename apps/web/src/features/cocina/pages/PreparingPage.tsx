import { Card, CardContent } from "@/shared/ui/Card"
import { EmptyState } from "@/shared/ui/EmptyState"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@/shared/ui/Badge"
import { ChefHat } from "lucide-react"

const preparingOrders = [
  { id: "pr1", table: 1, items: [{ name: "Tacos al Pastor", qty: 3 }, { name: "Guacamole", qty: 1 }], time: "10 min" },
]

export function PreparingPage() {
  if (preparingOrders.length === 0) {
    return (
      <>
        <div className="p-4">
          <div className="rounded-2xl bg-neutral-900 text-white px-4 py-3 flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Pedidos pendientes</p>
                <p className="text-lg font-bold">0</p>
              </div>
              <div className="w-px h-8 bg-neutral-700" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide">En preparación</p>
                <p className="text-lg font-bold">{preparingOrders.length}</p>
              </div>
              <div className="w-px h-8 bg-neutral-700" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Mesas activas</p>
                <p className="text-lg font-bold">{new Set(preparingOrders.map((o) => o.table)).size}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <EmptyState icon={<ChefHat size={48} />} title="Sin preparación activa" description="No hay órdenes en preparación" />
        </div>
      </>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-2xl bg-neutral-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Pedidos pendientes</p>
            <p className="text-lg font-bold">0</p>
          </div>
          <div className="w-px h-8 bg-neutral-700" />
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">En preparación</p>
            <p className="text-lg font-bold">{preparingOrders.length}</p>
          </div>
          <div className="w-px h-8 bg-neutral-700" />
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Mesas activas</p>
            <p className="text-lg font-bold">{new Set(preparingOrders.map((o) => o.table)).size}</p>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold text-neutral-900">En Preparación</h1>
        <p className="text-sm text-amber-600 font-medium">{preparingOrders.length} en proceso</p>
      </div>

      <div className="space-y-2">
        {preparingOrders.map((order) => (
          <Card key={order.id} className="border-amber-200 bg-amber-50/50">
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-neutral-900">Mesa {order.table}</span>
                <Badge variant="warning">{order.time}</Badge>
              </div>
              <p className="text-sm text-neutral-700 mb-3">{order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</p>
              <Button className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white">Marcar como Listo</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
