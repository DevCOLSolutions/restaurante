import { Card, CardContent } from "@/shared/ui/Card"
import { EmptyState } from "@/shared/ui/EmptyState"
import { Button } from "@workspace/ui/components/button"
import { ClipboardList } from "lucide-react"

const pendingOrders = [
  { id: "p1", table: 6, items: [{ name: "Hamburguesa Clásica", qty: 2 }, { name: "Papas Fritas", qty: 2 }], time: "15 min" },
  { id: "p2", table: 2, items: [{ name: "Enchiladas Verdes", qty: 2 }], time: "20 min" },
]

export function PendingPage() {
  if (pendingOrders.length === 0) {
    return (
      <>
        <div className="p-4">
          <div className="rounded-2xl bg-neutral-900 text-white px-4 py-3 flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Pedidos pendientes</p>
                <p className="text-lg font-bold">{pendingOrders.length}</p>
              </div>
              <div className="w-px h-8 bg-neutral-700" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide">En preparación</p>
                <p className="text-lg font-bold">0</p>
              </div>
              <div className="w-px h-8 bg-neutral-700" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Mesas activas</p>
                <p className="text-lg font-bold">{new Set(pendingOrders.map((o) => o.table)).size}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <EmptyState icon={<ClipboardList size={48} />} title="Sin pendientes" description="Todas las órdenes han sido procesadas" />
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
            <p className="text-lg font-bold">{pendingOrders.length}</p>
          </div>
          <div className="w-px h-8 bg-neutral-700" />
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">En preparación</p>
            <p className="text-lg font-bold">0</p>
          </div>
          <div className="w-px h-8 bg-neutral-700" />
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Mesas activas</p>
            <p className="text-lg font-bold">{new Set(pendingOrders.map((o) => o.table)).size}</p>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Pendientes</h1>
        <p className="text-sm text-neutral-500">{pendingOrders.length} órdenes esperando</p>
      </div>

      <div className="space-y-2">
        {pendingOrders.map((order) => (
          <Card key={order.id}>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-neutral-900">Mesa {order.table}</span>
                <span className="text-xs text-neutral-500">{order.time}</span>
              </div>
              <p className="text-sm text-neutral-700 mb-3">{order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}</p>
              <Button className="w-full rounded-xl">Iniciar Preparación</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
