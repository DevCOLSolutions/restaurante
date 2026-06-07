export type TableStatus = "libre" | "ocupada" | "reservada" | "limpieza"

export interface TableInfo {
  id: string
  number: number
  status: TableStatus
  seats: number
  zone?: string
  time?: string
  orderId?: string
  x: number
  y: number
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  notes?: string
}

export interface OrderInfo {
  id: string
  tableNumber: number
  items: OrderItem[]
  total: number
  status: "pending" | "preparing" | "ready" | "served" | "paid"
  createdAt: string
}
