import type { SucursalData, TableInfo } from "../types"

function generateTables(base: number, count: number, zone: string, zonePrefix: string): TableInfo[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `t-${zonePrefix}-${base + i}`,
    number: base + i,
    status: (i === 0 ? "ocupada" : i === 1 && count > 2 ? "reservada" : "libre") as TableInfo["status"],
    seats: [2, 4, 6, 8][i % 4],
    zone,
    time: i === 0 ? "45 min" : undefined,
    orderId: i === 0 ? `ord-${zonePrefix}-${base + i}` : undefined,
    x: 5 + i * 15,
    y: 10 + i * 12,
  }))
}

const sucursalesData: SucursalData[] = [
  {
    id: "suc-001",
    name: "Restaurante Centro",
    address: "Av. Principal 123, Centro",
    phone: "555-1000",
    zones: [
      { name: "Salón principal", type: "salon", icon: "Sofa" },
      { name: "Terraza interior", type: "terraza", icon: "Sun" },
      { name: "Barra", type: "barra", icon: "Wine" },
    ],
    tables: [
      ...generateTables(1, 8, "Salón principal", "SP"),
      ...generateTables(9, 4, "Terraza interior", "TI"),
      ...generateTables(13, 3, "Barra", "BR"),
    ],
    meseros: [
      { id: "m1", name: "Carlos López", username: "carlos.lopez", email: "carlos@centro.com", phone: "555-1001", status: "TURNO" },
      { id: "m2", name: "María García", username: "maria.garcia", email: "maria@centro.com", phone: "555-1002", status: "TURNO" },
      { id: "m3", name: "José Martínez", username: "jose.martinez", email: "jose@centro.com", phone: "555-1003", status: "DESCANSO" },
    ],
    admins: [
      { id: "a1", name: "Admin Centro", username: "admin.centro", email: "admin@centro.com", phone: "555-1099", status: "TURNO" },
    ],
    kitchenAreas: [
      { name: "Cocina caliente", description: "Área de platillos calientes" },
      { name: "Cocina fría", description: "Área de ensaladas y postres" },
    ],
  },
  {
    id: "suc-002",
    name: "Sucursal Norte",
    address: "Blvd. Norte 456, Col. Industrial",
    phone: "555-2000",
    zones: [
      { name: "Comedor principal", type: "salon", icon: "Sofa" },
      { name: "Zona infantil", type: "terraza", icon: "Sun" },
      { name: "Estacionamiento", type: "barra", icon: "Wine" },
    ],
    tables: [
      ...generateTables(1, 6, "Comedor principal", "CP"),
      ...generateTables(7, 3, "Zona infantil", "ZI"),
      ...generateTables(10, 2, "Estacionamiento", "ES"),
    ],
    meseros: [
      { id: "m4", name: "Ana Fernández", username: "ana.fernandez", email: "ana@norte.com", phone: "555-2001", status: "TURNO" },
      { id: "m5", name: "Pedro Sánchez", username: "pedro.sanchez", email: "pedro@norte.com", phone: "555-2002", status: "DESCANSO" },
      { id: "m6", name: "Lucía Ramírez", username: "lucia.ramirez", email: "lucia@norte.com", phone: "555-2003", status: "TURNO" },
      { id: "m7", name: "Roberto Díaz", username: "roberto.diaz", email: "roberto@norte.com", phone: "555-2004", status: "TURNO" },
    ],
    admins: [
      { id: "a2", name: "Admin Norte", username: "admin.norte", email: "admin@norte.com", phone: "555-2099", status: "TURNO" },
    ],
    kitchenAreas: [
      { name: "Cocina general", description: "Área de cocina principal" },
      { name: "Parrilla", description: "Área de carnes y parrilla" },
    ],
  },
  {
    id: "suc-003",
    name: "Terraza Sur",
    address: "Av. del Lago 789, Fracc. Sur",
    phone: "555-3000",
    zones: [
      { name: "Terraza abierta", type: "terraza", icon: "Sun" },
      { name: "Palapa", type: "salon", icon: "Sofa" },
      { name: "Jardín", type: "terraza", icon: "Sun" },
    ],
    tables: [
      ...generateTables(1, 5, "Terraza abierta", "TA"),
      ...generateTables(6, 3, "Palapa", "PL"),
      ...generateTables(9, 4, "Jardín", "JN"),
    ],
    meseros: [
      { id: "m8", name: "Sofía Torres", username: "sofia.torres", email: "sofia@terraza.com", phone: "555-3001", status: "TURNO" },
      { id: "m9", name: "Diego Vargas", username: "diego.vargas", email: "diego@terraza.com", phone: "555-3002", status: "DESCANSO" },
      { id: "m10", name: "Valentina Ríos", username: "valentina.rios", email: "valentina@terraza.com", phone: "555-3003", status: "TURNO" },
    ],
    admins: [
      { id: "a3", name: "Admin Terraza", username: "admin.terraza", email: "admin@terraza.com", phone: "555-3099", status: "TURNO" },
    ],
    kitchenAreas: [
      { name: "Cocina terraza", description: "Área de cocina especializada en mariscos" },
      { name: "Bar", description: "Área de bebidas y cocktails" },
      { name: "Postres", description: "Área de postres y cafetería" },
    ],
  },
  {
    id: "suc-004",
    name: "Barra Express",
    address: "Calle rápida 100, Zona Centro",
    phone: "555-4000",
    zones: [
      { name: "Barra principal", type: "barra", icon: "Wine" },
      { name: "Área de espera", type: "salon", icon: "Sofa" },
    ],
    tables: [
      ...generateTables(1, 6, "Barra principal", "BP"),
      ...generateTables(7, 3, "Área de espera", "AE"),
    ],
    meseros: [
      { id: "m11", name: "Diego Rivera", username: "diego.rivera", email: "diego@barra.com", phone: "555-4001", status: "TURNO" },
      { id: "m12", name: "Miguel Ángel", username: "miguel.angel", email: "miguel@barra.com", phone: "555-4002", status: "DESCANSO" },
      { id: "m13", name: "Laura Jiménez", username: "laura.jimenez", email: "laura@barra.com", phone: "555-4003", status: "TURNO" },
      { id: "m14", name: "Andrés Torres", username: "andres.torres", email: "andres@barra.com", phone: "555-4004", status: "TURNO" },
    ],
    admins: [
      { id: "a4", name: "Admin Barra", username: "admin.barra", email: "admin@barra.com", phone: "555-4099", status: "TURNO" },
    ],
    kitchenAreas: [
      { name: "Cocina rápida", description: "Área de preparación rápida" },
      { name: "Cocktails", description: "Área de preparación de bebidas y cocktails" },
    ],
  },
]

export function getSucursales(): SucursalData[] {
  return sucursalesData
}

export function getSucursalById(id: string): SucursalData | undefined {
  return sucursalesData.find((s) => s.id === id)
}
