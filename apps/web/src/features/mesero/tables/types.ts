export type TableStatus = "libre" | "ocupada" | "reservada" | "limpieza"

export interface Table {
  number: number
  people: number
  status: TableStatus
  time: string
}

export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface StatusConfig {
  label: string
  dot: string
  badge: string
}

export interface Zone {
  id: string
  label: string
}

export interface Filter {
  value: string
  label: string
}
