import type { TableInfo, OrderInfo } from "../types"

const mockTables: TableInfo[] = [
  { id: "t1", number: 1, status: "ocupada", seats: 4, time: "45 min", orderId: "ord-001", x: 5, y: 10 },
  { id: "t2", number: 2, status: "ocupada", seats: 2, time: "20 min", orderId: "ord-002", x: 5, y: 35 },
  { id: "t3", number: 3, status: "libre", seats: 6, x: 5, y: 60 },
  { id: "t4", number: 4, status: "libre", seats: 2, x: 50, y: 10 },
  { id: "t5", number: 5, status: "reservada", seats: 4, time: "19:30", x: 50, y: 35 },
  { id: "t6", number: 6, status: "ocupada", seats: 4, time: "60 min", orderId: "ord-003", x: 50, y: 60 },
  { id: "t7", number: 7, status: "limpieza", seats: 2, x: 30, y: 85 },
  { id: "t8", number: 8, status: "libre", seats: 8, x: 65, y: 85 },
]

const mockOrdersList: OrderInfo[] = [
  {
    id: "ord-001",
    tableNumber: 1,
    items: [
      { id: "i1", name: "Tacos al Pastor", quantity: 3, price: 45 },
      { id: "i2", name: "Guacamole", quantity: 1, price: 65 },
      { id: "i3", name: "Agua de Jamaica", quantity: 2, price: 25 },
    ],
    total: 230,
    status: "preparing",
    createdAt: "2026-05-26T13:15:00",
  },
  {
    id: "ord-002",
    tableNumber: 2,
    items: [
      { id: "i4", name: "Enchiladas Verdes", quantity: 2, price: 85 },
      { id: "i5", name: "Coca-Cola", quantity: 2, price: 20 },
    ],
    total: 210,
    status: "ready",
    createdAt: "2026-05-26T13:30:00",
  },
  {
    id: "ord-003",
    tableNumber: 6,
    items: [
      { id: "i6", name: "Hamburguesa Clásica", quantity: 2, price: 120 },
      { id: "i7", name: "Papas Fritas", quantity: 2, price: 55 },
      { id: "i8", name: "Malteada de Vainilla", quantity: 2, price: 45 },
    ],
    total: 440,
    status: "pending",
    createdAt: "2026-05-26T14:00:00",
  },
  {
    id: "ord-004",
    tableNumber: 5,
    items: [
      { id: "i9", name: "Ensalada César", quantity: 1, price: 95 },
    ],
    total: 95,
    status: "served",
    createdAt: "2026-05-26T12:45:00",
  },
]

export const restaurants = [
  { id: "rest-001", name: "Restaurante Principal", tables: mockTables },
]

export function getRestaurantTables(): TableInfo[] {
  return mockTables
}

export function mockOrders(): OrderInfo[] {
  return mockOrdersList
}

export function getTableById(id: string): TableInfo | undefined {
  return mockTables.find((t) => t.id === id)
}

export function getOrderById(id: string): OrderInfo | undefined {
  return mockOrdersList.find((o) => o.id === id)
}
