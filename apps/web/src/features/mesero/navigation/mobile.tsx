import { LayoutDashboard, UtensilsCrossed, ClipboardList, Bell, User } from "lucide-react"

export const meseroMobileNav = [
  { icon: <LayoutDashboard size={22} />, label: "Home", href: "/app/mesero" },
  { icon: <UtensilsCrossed size={22} />, label: "Mesas", href: "/app/mesero/tables" },
  { icon: <ClipboardList size={22} />, label: "Órdenes", href: "/app/mesero/orders" },
  { icon: <Bell size={22} />, label: "Listos", href: "/app/mesero/ready" },
  { icon: <User size={22} />, label: "Perfil", href: "/app/mesero/profile" },
]
