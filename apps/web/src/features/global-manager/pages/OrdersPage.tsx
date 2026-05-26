import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/Card"
import { Badge } from "@/shared/ui/Badge"
import { formatCurrency } from "@/core/utils"
import { mockOrders } from "../services"
import { EmptyState } from "@/shared/ui/EmptyState"
import { ClipboardList } from "lucide-react"

export function OrdersPage() {
  const orders = mockOrders()

  if (orders.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          icon={<ClipboardList size={48} />}
          title="Sin órdenes"
          description="No hay órdenes registradas hoy"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Órdenes</h1>
        <p className="text-sm text-neutral-500">{orders.length} órdenes hoy</p>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Mesa {order.tableNumber}</CardTitle>
              <Badge variant={order.status === "pending" ? "warning" : order.status === "preparing" ? "info" : order.status === "ready" ? "success" : "outline"}>
                {order.status === "pending" ? "Pendiente" : order.status === "preparing" ? "Preparando" : order.status === "ready" ? "Listo" : order.status === "served" ? "Servido" : "Pagado"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-neutral-800 font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-t border-neutral-100 pt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-800">Total</span>
                <span className="text-sm font-bold text-neutral-900">{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
