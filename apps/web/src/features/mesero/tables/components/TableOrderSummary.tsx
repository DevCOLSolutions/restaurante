import { formatCurrency } from "@/core/utils"
import type { OrderItem } from "../types"

interface TableOrderSummaryProps {
  items: OrderItem[]
}

export function TableOrderSummary({ items }: TableOrderSummaryProps) {
  if (items.length === 0) {
    return <p className="text-sm text-neutral-400">Sin artículos en la orden</p>
  }

  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-between text-sm">
          <span className="text-neutral-700">{item.quantity}x {item.name}</span>
          <span className="text-neutral-500 text-xs">{formatCurrency(item.price * item.quantity)}</span>
        </div>
      ))}
    </div>
  )
}
