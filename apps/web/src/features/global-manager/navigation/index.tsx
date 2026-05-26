import { LayoutDashboard, UtensilsCrossed, ClipboardList, ChefHat, Users, Settings } from "lucide-react"

export const globalManagerNavItems = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/app/global-manager" },
  { icon: <UtensilsCrossed size={20} />, label: "Mesas", href: "/app/global-manager/tables" },
  { icon: <ClipboardList size={20} />, label: "Órdenes", href: "/app/global-manager/orders" },
  { icon: <ChefHat size={20} />, label: "Cocina", href: "/app/global-manager/kitchen" },
  { icon: <Users size={20} />, label: "Reportes", href: "/app/global-manager/reports" },
  { icon: <Settings size={20} />, label: "Configuración", href: "/app/global-manager/settings" },
]
