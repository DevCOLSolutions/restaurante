import { Card, CardContent } from "@/shared/ui/Card"
import { Badge } from "@/shared/ui/Badge"
import { Button } from "@workspace/ui/components/button"

const mockKitchenOrders = [
  {
    id: "k1",
    tableNumber: 1,
    items: [
      { name: "Tacos al Pastor", quantity: 3, notes: "Sin cebolla" },
      { name: "Guacamole", quantity: 1 },
    ],
    status: "preparing" as const,
    time: "10 min",
    priority: "urgent" as const,
  },
  {
    id: "k2",
    tableNumber: 6,
    items: [
      { name: "Hamburguesa Clásica", quantity: 2, notes: "Término medio" },
      { name: "Papas Fritas", quantity: 2 },
    ],
    status: "pending" as const,
    time: "15 min",
    priority: "normal" as const,
  },
  {
    id: "k3",
    tableNumber: 2,
    items: [
      { name: "Enchiladas Verdes", quantity: 2 },
    ],
    status: "pending" as const,
    time: "20 min",
    priority: "normal" as const,
  },
]

export function CocinaDashboardPage() {
  const pending = mockKitchenOrders.filter((o) => o.status === "pending")
  const preparing = mockKitchenOrders.filter((o) => o.status === "preparing")

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Cocina</h1>
        <p className="text-sm text-neutral-500">Órdenes de cocina en tiempo real</p>
      </div>

      <div className="rounded-2xl bg-neutral-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Pedidos pendientes</p>
            <p className="text-lg font-bold">{pending.length}</p>
          </div>
          <div className="w-px h-8 bg-neutral-700" />
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">En preparación</p>
            <p className="text-lg font-bold">{preparing.length}</p>
          </div>
          <div className="w-px h-8 bg-neutral-700" />
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Mesas activas</p>
            <p className="text-lg font-bold">{new Set(mockKitchenOrders.map((o) => o.tableNumber)).size}</p>
          </div>
        </div>
      </div>

      {preparing.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-semibold text-amber-600">En Preparación</h2>
          <div className="space-y-3">
            {preparing.map((order) => (
              <Card key={order.id} className="border-amber-200 bg-amber-50/50">
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-neutral-900">Mesa {order.tableNumber}</span>
                    <Badge variant="warning">{order.time}</Badge>
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-neutral-800 font-medium">{item.quantity}x {item.name}</span>
                        {item.notes && <span className="text-neutral-500 ml-1">({item.notes})</span>}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white">
                    Marcar como Listo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-base font-semibold text-neutral-800">Pendientes</h2>
        <div className="space-y-3">
          {pending.map((order) => (
            <Card key={order.id}>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-neutral-900">Mesa {order.tableNumber}</span>
                  <Badge variant="outline">{order.time}</Badge>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="text-sm">
                      <span className="text-neutral-800 font-medium">{item.quantity}x {item.name}</span>
                      {item.notes && <span className="text-neutral-500 ml-1">({item.notes})</span>}
                    </div>
                  ))}
                </div>
                <Button className="w-full rounded-xl">
                  Iniciar Preparación
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
