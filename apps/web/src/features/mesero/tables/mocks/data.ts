import type { Table, OrderItem } from "../types"

// TODO: reemplazar con llamada a API
export const tablesByZone: Record<string, Table[]> = {
  salon: [
    { number: 1, people: 2, status: "libre", time: "-" },
    { number: 3, people: 4, status: "ocupada", time: "45 min" },
    { number: 5, people: 6, status: "ocupada", time: "30 min" },
    { number: 7, people: 2, status: "libre", time: "-" },
    { number: 9, people: 4, status: "reservada", time: "20:00" },
  ],
  terraza: [
    { number: 2, people: 4, status: "ocupada", time: "60 min" },
    { number: 4, people: 2, status: "libre", time: "-" },
    { number: 6, people: 6, status: "ocupada", time: "25 min" },
    { number: 8, people: 4, status: "limpieza", time: "5 min" },
  ],
  barra: [
    { number: 10, people: 1, status: "ocupada", time: "15 min" },
    { number: 11, people: 2, status: "libre", time: "-" },
    { number: 12, people: 1, status: "ocupada", time: "40 min" },
  ],
}

// TODO: reemplazar con llamada a API
export const waiterByTable: Record<number, string> = {
  3: "Carlos", 5: "Andrés", 2: "Carlos", 6: "Andrés", 10: "María", 12: "Andrés",
}

// TODO: reemplazar con llamada a API
export const ordersByTable: Record<number, OrderItem[]> = {
  5:  [{ name: "Tacos al Pastor", quantity: 2, price: 45 }, { name: "Guacamole", quantity: 1, price: 65 }],
  6:  [{ name: "Hamburguesa Clásica", quantity: 1, price: 120 }, { name: "Papas Fritas", quantity: 2, price: 55 }, { name: "Agua de Jamaica", quantity: 2, price: 25 }],
  12: [{ name: "Enchiladas Verdes", quantity: 1, price: 85 }, { name: "Malteada de Vainilla", quantity: 1, price: 45 }],
  3:  [{ name: "Ensalada César", quantity: 1, price: 95 }],
  2:  [{ name: "Tacos al Pastor", quantity: 3, price: 45 }, { name: "Café", quantity: 2, price: 35 }],
  10: [{ name: "Flan Napolitano", quantity: 1, price: 50 }],
}

export function getAllTables(): Table[] {
  return Object.values(tablesByZone).flat()
}

export function getMyTables(currentUser: string): Table[] {
  return getAllTables().filter(
    (t) => waiterByTable[t.number] === currentUser && t.status === "ocupada"
  )
}
