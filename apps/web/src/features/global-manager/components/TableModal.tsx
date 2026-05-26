import { Modal } from "@/shared/ui/Modal"
import { Badge } from "@/shared/ui/Badge"
import { Button } from "@workspace/ui/components/button"
import { formatCurrency } from "@/core/utils"
import type { TableInfo, OrderInfo } from "../types"
import { getOrderById } from "../services"

interface TableModalProps {
  table: TableInfo | null
  open: boolean
  onClose: () => void
}

const statusVariant: Record<string, "success" | "warning" | "danger" | "info" | "outline"> = {
  libre: "success",
  ocupada: "warning",
  reservada: "info",
  limpieza: "outline",
}

const statusLabels: Record<string, string> = {
  libre: "Libre",
  ocupada: "Ocupada",
  reservada: "Reservada",
  limpieza: "Limpieza",
}

export function TableModal({ table, open, onClose }: TableModalProps) {
  if (!table) return null

  const order: OrderInfo | undefined = table.orderId ? getOrderById(table.orderId) : undefined

  return (
    <Modal open={open} onClose={onClose} title={`Mesa ${table.number}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">{table.seats} personas</span>
          </div>
          <Badge variant={statusVariant[table.status]}>{statusLabels[table.status]}</Badge>
        </div>

        {table.time && (
          <div className="rounded-xl bg-neutral-50 px-4 py-2">
            <p className="text-xs text-neutral-500">
              {table.status === "reservada" ? "Reservada para las" : "Tiempo activo"}
            </p>
            <p className="text-sm font-semibold text-neutral-800">{table.time}</p>
          </div>
        )}

        {order && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-neutral-800">Orden Activa</h4>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium text-neutral-800">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t border-neutral-200 pt-2 flex items-center justify-between text-sm font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <Badge variant={order.status === "paid" ? "success" : "warning"}>
                {order.status === "paid" ? "Pagado" : "Pendiente"}
              </Badge>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button className="flex-1 rounded-xl" variant="default">
            {table.status === "libre" ? "Ocupar Mesa" : "Agregar Orden"}
          </Button>
          {table.status === "ocupada" && (
            <>
              <Button className="flex-1 rounded-xl" variant="outline">
                Cobrar
              </Button>
              <Button className="flex-1 rounded-xl" variant="outline">
                Transferir
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
