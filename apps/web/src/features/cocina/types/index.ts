export interface KitchenOrder {
  id: string
  tableNumber: number
  items: { name: string; quantity: number; notes?: string }[]
  status: "pending" | "preparing" | "ready"
  time: string
  priority: "normal" | "urgent"
}
