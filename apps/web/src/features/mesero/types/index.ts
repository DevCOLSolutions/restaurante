export interface TableSummary {
  id: string
  number: number
  status: string
  orderCount: number
  total: number
}

export interface PendingOrder {
  id: string
  tableNumber: number
  items: string[]
  status: string
  time: string
}
