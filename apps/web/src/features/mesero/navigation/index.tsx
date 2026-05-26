import { LayoutDashboard, UtensilsCrossed, ClipboardList, ChefHat, User } from "lucide-react"

export const meseroNavItems = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/app/mesero" },
  { icon: <UtensilsCrossed size={20} />, label: "Mesas", href: "/app/mesero/tables" },
  { icon: <ClipboardList size={20} />, label: "Órdenes", href: "/app/mesero/orders" },
  { icon: <ChefHat size={20} />, label: "Pedidos Listos", href: "/app/mesero/ready" },
  { icon: <User size={20} />, label: "Perfil", href: "/app/mesero/profile" },
]
