import { Card, CardContent } from "@/shared/ui/Card"
import { Badge } from "@/shared/ui/Badge"
import { EmptyState } from "@/shared/ui/EmptyState"
import { Button } from "@workspace/ui/components/button"
import { Bell } from "lucide-react"

export function MeseroReadyPage() {
  const readyOrders = [
    { id: "r1", table: 4, items: "3x Enchiladas Verdes, 2x Agua de Jamaica" },
    { id: "r2", table: 7, items: "1x Guacamole, 1x Tacos al Pastor" },
  ]

  if (readyOrders.length === 0) {
    return (
      <div className="p-4">
        <EmptyState icon={<Bell size={48} />} title="Sin pedidos listos" description="Los pedidos listos aparecerán aquí" />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Pedidos Listos</h1>
        <p className="text-sm text-emerald-600 font-medium">{readyOrders.length} listos para servir</p>
      </div>

      <div className="space-y-2">
        {readyOrders.map((order) => (
          <Card key={order.id} className="border-emerald-200 bg-emerald-50/50">
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-neutral-900">Mesa {order.table}</span>
                <Badge variant="success">Listo</Badge>
              </div>
              <p className="text-sm text-neutral-600 mb-3">{order.items}</p>
              <Button className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white">
                Entregar a Mesa {order.table}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
