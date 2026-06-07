import { Grid3x3, Users, ChefHat, FileClock } from "lucide-react"

export const adminSucursalMobileNav = [
  { icon: <Grid3x3 size={22} />, label: "Mesas", href: "/app/admin-sucursal", end: true },
  { icon: <FileClock size={22} />, label: "Órdenes", href: "/app/admin-sucursal/orders" },
  { icon: <Users size={22} />, label: "Meseros", href: "/app/admin-sucursal/meseros" },
  { icon: <ChefHat size={22} />, label: "Cocina", href: "/app/admin-sucursal/kitchen" },
]
