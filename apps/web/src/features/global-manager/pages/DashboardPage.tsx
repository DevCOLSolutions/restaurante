import { DollarSign, ClipboardList, Users, ChefHat } from "lucide-react"
import { MetricCard } from "../components/MetricCard"
import { RestaurantMap } from "../components/RestaurantMap"
import { TableModal } from "../components/TableModal"
import { useState } from "react"
import type { TableInfo } from "../types"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/Card"
import { Badge } from "@/shared/ui/Badge"
import { formatCurrency } from "@/core/utils"
import { mockOrders } from "../services"

export function GlobalManagerDashboardPage() {
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const orders = mockOrders()

  const handleTableClick = (table: TableInfo) => {
    setSelectedTable(table)
    setModalOpen(true)
  }

  const activeOrders = orders.filter((o) => o.status !== "paid").length
  const totalSales = orders.filter((o) => o.status === "paid" || o.status === "served").reduce((sum, o) => sum + o.total, 0)
  const occupiedTables = 3

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500">Resumen del restaurante</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard title="Ventas Hoy" value={formatCurrency(totalSales)} icon={<DollarSign size={20} />} trend="+12% vs ayer" trendUp />
        <MetricCard title="Órdenes Activas" value={activeOrders} icon={<ClipboardList size={20} />} />
        <MetricCard title="Mesas Ocupadas" value={`${occupiedTables}/8`} icon={<Users size={20} />} trend="62% capacidad" />
        <MetricCard title="Cocina" value="3 pedidos" icon={<ChefHat size={20} />} trend="2 en preparación" />
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-neutral-800">Plano del Restaurante</h2>
        <RestaurantMap onTableClick={handleTableClick} />
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-neutral-800">Órdenes Recientes</h2>
        <div className="space-y-2">
          {orders.slice(0, 3).map((order) => (
            <Card key={order.id}>
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

      <TableModal table={selectedTable} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
