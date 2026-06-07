import { Grid3x3, Users, ChefHat, FileClock } from "lucide-react"

export const adminSucursalNavItems = [
  { icon: <Grid3x3 size={20} />, label: "Mesas", href: "/app/admin-sucursal", end: true },
  { icon: <FileClock size={20} />, label: "Órdenes", href: "/app/admin-sucursal/orders" },
  { icon: <Users size={20} />, label: "Meseros", href: "/app/admin-sucursal/meseros" },
  { icon: <ChefHat size={20} />, label: "Cocina", href: "/app/admin-sucursal/kitchen" },
]
