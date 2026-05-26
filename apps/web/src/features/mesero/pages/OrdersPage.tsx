import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/Card"
import { Badge } from "@/shared/ui/Badge"
import { formatCurrency } from "@/core/utils"
import { EmptyState } from "@/shared/ui/EmptyState"
import { ClipboardList } from "lucide-react"
import { mockOrders } from "@/features/global-manager/services"

export function MeseroOrdersPage() {
  const orders = mockOrders()

  if (orders.length === 0) {
    return (
      <div className="p-4">
        <EmptyState icon={<ClipboardList size={48} />} title="Sin órdenes" description="No hay órdenes activas" />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Órdenes</h1>
        <p className="text-sm text-neutral-500">{orders.length} órdenes activas</p>
      </div>

      <div className="space-y-2">
        {orders.map((order) => (
          <Card key={order.id} hover>
            <CardHeader>
              <CardTitle>Mesa {order.tableNumber}</CardTitle>
              <Badge variant={order.status === "pending" ? "warning" : order.status === "preparing" ? "info" : "success"}>
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600">{order.items.length} artículos</p>
              <p className="text-sm font-semibold text-neutral-800">{formatCurrency(order.total)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
